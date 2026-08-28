import './style.css';
import { demoCases } from './demo';
import { parseVerdict, productSlug, shouldVerify, type Verdict } from './license';

const byId = <T extends HTMLElement>(id: string): T | null => document.getElementById(id) as T | null;

function setupDemo(): void {
  const tabs = [...document.querySelectorAll<HTMLButtonElement>('[role="tab"][data-case]')];
  const panel = byId<HTMLElement>('case-panel');
  if (!panel || tabs.length === 0) return;

  const select = (tab: HTMLButtonElement, focus = false): void => {
    const data = demoCases[tab.dataset.case || 'value'];
    if (!data) return;
    tabs.forEach((item) => {
      const active = item === tab;
      item.setAttribute('aria-selected', String(active));
      item.tabIndex = active ? 0 : -1;
    });
    panel.setAttribute('aria-labelledby', tab.id);
    const fields: Record<string, string> = {
      'demo-case-name': data.name,
      'demo-rows': data.rows,
      'demo-time': data.time,
      'demo-memory': data.memory,
      'demo-stream': data.stream,
      'demo-code': data.code,
      'demo-finding': data.finding,
      'demo-heuristic': data.heuristic
    };
    Object.entries(fields).forEach(([id, value]) => {
      const element = byId(id);
      if (element) element.textContent = value;
    });
    panel.classList.remove('is-changing');
    requestAnimationFrame(() => panel.classList.add('is-changing'));
    if (focus) tab.focus();
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', (event) => {
      let next = index;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault();
      select(tabs[next], true);
    });
  });
}

function setupCopy(): void {
  const announcer = byId('announcer');
  document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((button) => {
    button.addEventListener('click', async () => {
      const original = button.textContent || 'Copy';
      try {
        await navigator.clipboard.writeText(button.dataset.copy || '');
        button.textContent = 'Copied';
        if (announcer) announcer.textContent = `${original} copied to clipboard`;
      } catch {
        button.textContent = 'Select command';
        button.previousElementSibling?.scrollIntoView({ block: 'nearest' });
        if (announcer) announcer.textContent = 'Clipboard access is unavailable; select the command text.';
      }
      window.setTimeout(() => { button.textContent = original; }, 1800);
    });
  });
}

function setupLicense(): void {
  const slug = productSlug();
  const tokenKey = `sb_license:${slug}`;
  const verdictKey = `${tokenKey}:verdict`;
  const status = byId('license-status');
  const form = byId<HTMLFormElement>('license-form');
  const input = byId<HTMLInputElement>('license-token');
  const download = byId<HTMLButtonElement>('download-kit');
  if (!status || !form || !input || !download) return;

  const show = (message: string, unlocked: boolean, error = false): void => {
    status.textContent = message;
    status.classList.toggle('error', error);
    download.hidden = !unlocked;
  };

  const verify = async (token: string, force = false): Promise<void> => {
    const cached = parseVerdict(localStorage.getItem(verdictKey));
    if (cached?.token === token && cached.valid) show('Field Kit unlocked from this device.', true);
    if (!force && !shouldVerify(cached, token)) {
      if (!cached?.valid) show('License no longer active. The free CLI remains available.', false, true);
      return;
    }
    status.textContent = cached?.valid ? 'Field Kit unlocked. Rechecking quietly…' : 'Checking license…';
    try {
      const endpoint = `https://api.sociobot.in/api/v1/products/${encodeURIComponent(slug)}/verify?license=${encodeURIComponent(token)}`;
      const response = await fetch(endpoint, { headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error(`verification returned ${response.status}`);
      const body = await response.json() as { valid?: boolean; reason?: string };
      const verdict: Verdict = { token, valid: body.valid === true, reason: body.reason || 'invalid', checkedAt: Date.now() };
      localStorage.setItem(verdictKey, JSON.stringify(verdict));
      if (verdict.valid) show('License verified. Field Kit unlocked.', true);
      else show('License no longer active. You can keep using the free CLI.', false, true);
    } catch {
      if (cached?.token === token && cached.valid) show('Offline verification skipped. Field Kit remains unlocked from the last valid check.', true);
      else show('Could not verify right now. Check your connection; the free CLI still works.', false, true);
    }
  };

  const url = new URL(location.href);
  const returnedToken = url.searchParams.get('license');
  if (returnedToken) {
    localStorage.setItem(tokenKey, returnedToken.trim());
    url.searchParams.delete('license');
    history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
  }
  const storedToken = returnedToken?.trim() || localStorage.getItem(tokenKey)?.trim();
  if (storedToken) {
    input.value = storedToken;
    void verify(storedToken);
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const token = input.value.trim();
    if (!token) {
      show('Paste the license token from your receipt, then verify again.', false, true);
      input.focus();
      return;
    }
    localStorage.setItem(tokenKey, token);
    void verify(token, true);
  });

  download.addEventListener('click', () => {
    const kit = `# Data Engine Switchboard — Migration Field Kit\n\n## Fixture matrix\n- Typical CSV and Parquet partitions\n- Null-heavy and empty inputs\n- DST boundary timestamps\n- Duplicate keys and unstable source order\n- Float values around business rounding thresholds\n\n## CI policy\nRun: switchboard assess switchboard.toml --json --output switchboard-report.json\nTreat exit 2 as a migration block and exit 3 as an infrastructure/configuration failure.\n\n## Rollout checkpoints\n1. Redact representative fixtures.\n2. Resolve every measured mismatch.\n3. Review each heuristic against the installed Polars version.\n4. Repeat under production-like volume.\n5. Canary, observe, then retire the Pandas path.\n`;
    const href = URL.createObjectURL(new Blob([kit], { type: 'text/markdown' }));
    const anchor = document.createElement('a');
    anchor.href = href;
    anchor.download = 'data-engine-switchboard-field-kit.md';
    anchor.click();
    URL.revokeObjectURL(href);
  });
}

function setupOffline(): void {
  const notice = byId('offline-notice');
  const update = (): void => { if (notice) notice.hidden = navigator.onLine; };
  window.addEventListener('online', update);
  window.addEventListener('offline', update);
  update();
  if ('serviceWorker' in navigator) void navigator.serviceWorker.register('/sw.js');
}

setupDemo();
setupCopy();
setupLicense();
setupOffline();

