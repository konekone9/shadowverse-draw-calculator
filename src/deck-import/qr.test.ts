import { describe, expect, it } from 'vitest';
import { validateQrImage } from './qr';

describe('QR image validation', () => {
  it('rejects non-image files', () => expect(() => validateQrImage(new File(['x'], 'deck.txt', { type: 'text/plain' }))).toThrow('画像ファイル'));
  it('accepts an image under the size limit', () => expect(() => validateQrImage(new File(['x'], 'deck.png', { type: 'image/png' }))).not.toThrow());
});
