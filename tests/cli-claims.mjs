import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const python = process.env.SWITCHBOARD_TEST_PYTHON || join(root, '.test-venv/bin/python');
const run = (args) => spawnSync('cargo', args, { cwd: root, encoding: 'utf8' });
const requested = process.argv[2] || 'all';
const check = (id, fn) => { if (requested === 'all' || requested === id) { console.log(`@claim:${id}`); fn(); } };

check('cli-demo-report', () => {
  const result = run(['run', '--quiet', '--manifest-path', 'crates/switchboard/Cargo.toml', '--', 'demo', '--python', python]);
  assert.equal(result.status, 2, result.stderr);
  const path = result.stdout.match(/^REPORT\s+(.+)$/m)?.[1];
  assert.ok(path && existsSync(path), result.stdout);
  const report = JSON.parse(readFileSync(path, 'utf8'));
  assert.equal(report.decision, 'no_go');
  assert.deepEqual(report.cases.map((item) => item.findings[0].category), ['value', 'schema', 'order']);
});

check('fixture-bound-before-import', () => {
  const dir = mkdtempSync(join(tmpdir(), 'switchboard-bound-'));
  try {
    writeFileSync(join(dir, 'input.csv'), `a\n${'1\n'.repeat(700_000)}`);
    writeFileSync(join(dir, 'transform.py'), "open('imported.txt', 'w').write('imported')\n");
    writeFileSync(join(dir, 'switchboard.toml'), `version = 1\npython = ${JSON.stringify(python)}\nmodule = \"transform.py\"\nsamples = 1\nmax_fixture_mb = 1\n[[case]]\nname = \"too large\"\nfixture = \"input.csv\"\npandas = \"x\"\npolars = \"x\"\n`);
    const result = run(['run', '--quiet', '--manifest-path', 'crates/switchboard/Cargo.toml', '--', 'assess', join(dir, 'switchboard.toml'), '--json']);
    assert.equal(result.status, 3, result.stderr);
    assert.match(result.stderr, /above the declared 1 MB limit/);
    assert.equal(existsSync(join(dir, 'imported.txt')), false);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

check('cli-local-no-telemetry', () => {
  const source = readFileSync(join(root, 'crates/switchboard/src/runner.py'), 'utf8');
  assert.doesNotMatch(source, /\b(?:requests|urllib|http\.client|socket)\b/);
  assert.match(source, /Embedded Python bridge\. It never performs network I\/O/);
});
