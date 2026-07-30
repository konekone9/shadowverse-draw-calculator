import { describe, expect, it } from 'vitest';
import { validateDeckPortalUrl } from './portal-url';
describe('Deck Portal URL', () => {
  it('accepts only the documented URL shape', () => expect(validateDeckPortalUrl('https://shadowverse-wb.com/ja/deck/detail/?hash=abc').hash).toBe('abc'));
  it('rejects foreign hosts', () => expect(() => validateDeckPortalUrl('https://example.com/ja/deck/detail/?hash=abc')).toThrow());
});
