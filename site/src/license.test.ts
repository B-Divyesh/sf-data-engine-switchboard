import { describe, expect, it } from 'vitest';
import { DAY_MS, parseVerdict, shouldVerify } from './license';

describe('license verdict cache', () => {
  it('verifies new and day-old verdicts but not fresh matching verdicts', () => {
    const now = 1_000_000_000;
    const verdict = { token: 'abc', valid: true, reason: 'ok', checkedAt: now - 1000 };
    expect(shouldVerify(null, 'abc', now)).toBe(true);
    expect(shouldVerify(verdict, 'abc', now)).toBe(false);
    expect(shouldVerify(verdict, 'different', now)).toBe(true);
    expect(shouldVerify({ ...verdict, checkedAt: now - DAY_MS }, 'abc', now)).toBe(true);
  });

  it('rejects malformed cached data', () => {
    expect(parseVerdict('{broken')).toBeNull();
    expect(parseVerdict('{"valid":true}')).toBeNull();
    expect(parseVerdict('{"token":"x","valid":true,"checkedAt":2,"reason":"ok"}')).toEqual({ token: 'x', valid: true, checkedAt: 2, reason: 'ok' });
  });
});

