export const DAY_MS = 86_400_000;

export type Verdict = {
  token: string;
  valid: boolean;
  checkedAt: number;
  reason: string;
};

export function shouldVerify(verdict: Verdict | null, token: string, now = Date.now()): boolean {
  return !verdict || verdict.token !== token || now - verdict.checkedAt >= DAY_MS;
}

export function parseVerdict(raw: string | null): Verdict | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Partial<Verdict>;
    if (typeof value.token !== 'string' || typeof value.valid !== 'boolean' || typeof value.checkedAt !== 'number' || typeof value.reason !== 'string') return null;
    return value as Verdict;
  } catch {
    return null;
  }
}

export function productSlug(): string {
  return document.documentElement.dataset.productSlug || location.hostname.split('.')[0];
}

