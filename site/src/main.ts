import './style.css';
import { demoCases } from './demo';

const byId = <T extends HTMLElement>(id: string): T | null => document.getElementById(id) as T | null;

function setupDemoTabs(): void {
  const tabs = [...document.querySelectorAll<HTMLButtonElement>('[role="tab"][data-case]')];
  const panel = byId<HTMLElement>('case-panel');
  if (!panel || tabs.length === 0) return;
  const select = (tab: HTMLButtonElement, focus = false): void => {
    const data = demoCases[tab.dataset.case || 'value'];
    if (!data) return;
    tabs.forEach((item) => { const active = item === tab; item.setAttribute('aria-selected', String(active)); item.tabIndex = active ? 0 : -1; });
    panel.setAttribute('aria-labelledby', tab.id);
    ([['demo-case-name', data.name], ['demo-code', data.code], ['demo-finding', data.finding], ['demo-heuristic', data.heuristic]] as const).forEach(([id, value]) => { const element = byId(id); if (element) element.textContent = value; });
    panel.classList.remove('is-changing'); requestAnimationFrame(() => panel.classList.add('is-changing'));
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
      event.preventDefault(); select(tabs[next], true);
    });
  });
}

function setupCopy(): void {
  const announcer = byId('announcer');
  document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((button) => button.addEventListener('click', async () => {
    const original = button.textContent || 'Copy';
    try { await navigator.clipboard.writeText(button.dataset.copy || ''); button.textContent = 'Copied'; if (announcer) announcer.textContent = `${original} copied to clipboard`; }
    catch { button.textContent = 'Select command'; if (announcer) announcer.textContent = 'Clipboard access is unavailable; select the command text.'; }
    window.setTimeout(() => { button.textContent = original; }, 1800);
  }));
}

function setupDemoIsolation(): void {
  if (new URLSearchParams(location.search).get('demo') === '1' && !document.documentElement.dataset.demo) { location.replace('/demo/'); return; }
  if (!document.documentElement.dataset.demo) return;
  const resetDemo = (): void => {
    Object.keys(localStorage).filter((key) => key.startsWith('demo:')).forEach((key) => localStorage.removeItem(key));
    localStorage.setItem('demo:data-engine-switchboard:opened', String(Date.now()));
    const announcer = byId('announcer'); if (announcer) announcer.textContent = 'Demo reset. The bundled sample is ready.';
  };
  byId<HTMLButtonElement>('reset-demo')?.addEventListener('click', resetDemo);
  if (!localStorage.getItem('demo:data-engine-switchboard:opened')) resetDemo();
}

function setupRouteFocus(): void {
  const heading = document.querySelector<HTMLElement>('main h1');
  if (!heading) return;
  heading.focus({ preventScroll: true });
  const announcer = byId('announcer'); if (announcer) announcer.textContent = document.title;
}

setupDemoTabs();
setupCopy();
setupDemoIsolation();
setupRouteFocus();
