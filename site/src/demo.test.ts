import { describe, expect, it } from 'vitest';
import { demoCases } from './demo';

describe('bundled report copy', () => {
  it('names the three measured difference categories', () => {
    expect(Object.values(demoCases).map((entry) => entry.code)).toEqual(['VALUE', 'TYPE', 'ORDER']);
  });
});
