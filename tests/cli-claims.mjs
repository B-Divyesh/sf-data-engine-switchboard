import assert from 'node:assert/strict';
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, join } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const python = process.env.SWITCHBOARD_TEST_PYTHON || join(root, '.test-venv/bin/python');
const manifest = join(root, 'crates/switchboard/Cargo.toml');
const requested = process.argv[2] || 'all';
const check = (id, fn) => {
  if (requested === 'all' || requested === id) {
    console.log(`@claim:${id}`);
    fn();
  }
};
const run = (args, options = {}) => spawnSync('cargo', ['run', '--quiet', '--manifest-path', manifest, '--', ...args], {
  cwd: options.cwd || root,
  encoding: 'utf8',
  env: { ...process.env, ...(options.env || {}) }
});
const reportFromDemo = (options = {}) => {
  const result = run(['demo', '--python', python], options);
  assert.equal(result.status, 2, result.stderr);
  const reportPath = result.stdout.match(/^REPORT\s+(.+)$/m)?.[1];
  assert.ok(reportPath && existsSync(reportPath), result.stdout);
  return { result, path: reportPath, report: JSON.parse(readFileSync(reportPath, 'utf8')) };
};

check('recorded-cli-demo', () => {
  const { report } = reportFromDemo();
  const recording = readFileSync(join(root, 'site/public/switchboard-demo-recording.svg'), 'utf8');
  assert.equal(report.decision, 'no_go');
  assert.deepEqual(report.cases.map((item) => item.findings[0].category), ['value', 'schema', 'order']);
  assert.equal(report.summary.heuristic_flags, 1);
  for (const text of ['DECISION  NO-GO', 'Value:', 'Schema:', 'Order:', 'global_sort', 'runtime', 'peak RSS']) assert.match(recording, new RegExp(text));
});

check('report-evidence', () => {
  const { report } = reportFromDemo();
  for (const item of report.cases) {
    assert.ok(item.measured.runtime_ms.pandas.median >= 0);
    assert.ok(item.measured.runtime_ms.polars.median >= 0);
    assert.ok(item.measured.peak_process_memory_bytes.pandas.median > 0);
    assert.ok(item.measured.peak_process_memory_bytes.polars.median > 0);
    assert.equal(item.measured.output_rows.pandas, 3);
    assert.equal(item.measured.output_rows.polars, 3);
  }
  assert.equal(report.cases[2].heuristics[0].rule, 'global_sort');
  assert.equal(report.cases[2].heuristics[0].caveat.includes('not a measured'), true);
});

check('cli-output-contract', () => {
  const dir = mkdtempSync(join(tmpdir(), 'switchboard-output-'));
  try {
    const assessment = join(dir, 'assessment');
    mkdirSync(join(assessment, 'fixtures'), { recursive: true });
    copyFileSync(join(root, 'examples/seeded/transform.py'), join(assessment, 'transform.py'));
    copyFileSync(join(root, 'examples/seeded/fixtures/orders.csv'), join(assessment, 'fixtures/orders.csv'));
    const config = join(assessment, 'switchboard.toml');
    writeFileSync(config, readFileSync(join(root, 'examples/seeded/switchboard.toml'), 'utf8').replace('python = "python3"', `python = ${JSON.stringify(python)}`));
    const output = join(dir, 'report.json');
    const result = run(['assess', config, '--json', '--output', output], { cwd: dir });
    assert.equal(result.status, 2, result.stderr);
    assert.equal(readFileSync(output, 'utf8'), `${result.stdout.trim()}\n`);
    assert.equal(JSON.parse(result.stdout).decision, 'no_go');
    assert.equal(result.stderr, '');
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

check('comparison-policy', () => {
  const dir = mkdtempSync(join(tmpdir(), 'switchboard-policy-'));
  try {
    const assessment = join(dir, 'assessment');
    mkdirSync(join(assessment, 'fixtures'), { recursive: true });
    copyFileSync(join(root, 'examples/seeded/transform.py'), join(assessment, 'transform.py'));
    copyFileSync(join(root, 'examples/seeded/fixtures/orders.csv'), join(assessment, 'fixtures/orders.csv'));
    const base = readFileSync(join(root, 'examples/seeded/switchboard.toml'), 'utf8').replace('python = "python3"', `python = ${JSON.stringify(python)}`);
    for (const expected of [
      { schema: 'strict', order: 'strict', nulls: 'nan_equal', timezone: 'utc', float_abs: 1e-9, float_rel: 1e-7 },
      { schema: 'compatible', order: 'ignore', nulls: 'strict', timezone: 'ignore', float_abs: 0.25, float_rel: 0.5 },
      { schema: 'ignore', order: 'strict', nulls: 'nan_equal', timezone: 'strict', float_abs: 0, float_rel: 0 }
    ]) {
      const text = base.replace(/schema = "[^"]+"/, `schema = "${expected.schema}"`).replace(/order = "[^"]+"/, `order = "${expected.order}"`).replace(/nulls = "[^"]+"/, `nulls = "${expected.nulls}"`).replace(/timezone = "[^"]+"/, `timezone = "${expected.timezone}"`).replace(/float_abs = [^\n]+/, `float_abs = ${expected.float_abs}`).replace(/float_rel = [^\n]+/, `float_rel = ${expected.float_rel}`);
      const config = join(assessment, 'switchboard.toml');
      writeFileSync(config, text);
      const result = run(['assess', config, '--json'], { cwd: dir });
      assert.ok([0, 2].includes(result.status), result.stderr);
      assert.deepEqual(JSON.parse(result.stdout).comparison, expected);
    }
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

check('fixture-bound-before-import', () => {
  const dir = mkdtempSync(join(tmpdir(), 'switchboard-bound-'));
  try {
    writeFileSync(join(dir, 'input.csv'), `a\n${'1\n'.repeat(700_000)}`);
    writeFileSync(join(dir, 'transform.py'), "open('imported.txt', 'w').write('imported')\n");
    writeFileSync(join(dir, 'switchboard.toml'), `version = 1\npython = ${JSON.stringify(python)}\nmodule = "transform.py"\nsamples = 1\nmax_fixture_mb = 1\n[[case]]\nname = "too large"\nfixture = "input.csv"\npandas = "x"\npolars = "x"\n`);
    const result = run(['assess', join(dir, 'switchboard.toml'), '--json']);
    assert.equal(result.status, 3, result.stderr);
    assert.match(result.stderr, /above the declared 1 MB limit/);
    assert.equal(existsSync(join(dir, 'imported.txt')), false);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

check('cli-local-only', () => {
  const dir = mkdtempSync(join(tmpdir(), 'switchboard-no-network-'));
  try {
    const source = join(dir, 'deny-network.c');
    const library = join(dir, 'deny-network.so');
    writeFileSync(source, `#define _GNU_SOURCE\n#include <sys/socket.h>\n#include <errno.h>\nint socket(int d,int t,int p){if(d==AF_INET||d==AF_INET6){errno=ENETDOWN;return -1;}return -1;}\nint connect(int f,const struct sockaddr*a,socklen_t l){errno=ENETDOWN;return -1;}\n`);
    const compiler = spawnSync('cc', ['-shared', '-fPIC', source, '-o', library], { encoding: 'utf8' });
    assert.equal(compiler.status, 0, compiler.stderr);
    const { result, path, report } = reportFromDemo({ env: { LD_PRELOAD: library } });
    assert.match(result.stdout, /LOCAL\s+No fixture data was uploaded/);
    assert.equal(report.privacy, 'local_only_no_upload');
    assert.equal(basename(path), 'switchboard-report.json');
    assert.equal(path.includes(root), false);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
