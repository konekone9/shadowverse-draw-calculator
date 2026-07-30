import { BrowserQRCodeReader } from '@zxing/browser';
import { validateDeckPortalUrl } from './portal-url';

const maxBytes = 10 * 1024 * 1024;
const maxPixels = 20_000_000;

export function validateQrImage(file: File) {
  if (!file.type.startsWith('image/')) throw new Error('画像ファイルを選択してください。');
  if (file.size > maxBytes) throw new Error('画像は10MB以下にしてください。');
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('画像を読み込めませんでした。'));
    image.src = src;
  });
}

async function decodeImage(reader: BrowserQRCodeReader, image: HTMLImageElement) {
  const result = await reader.decodeFromImageElement(image);
  return result.getText();
}

async function canvasImage(canvas: HTMLCanvasElement) {
  return loadImage(canvas.toDataURL('image/png'));
}

async function topRightCandidate(image: HTMLImageElement) {
  const canvas = document.createElement('canvas');
  canvas.width = Math.ceil(image.naturalWidth * 0.55);
  canvas.height = Math.ceil(image.naturalHeight * 0.55);
  const context = canvas.getContext('2d');
  if (!context) return null;
  context.drawImage(image, image.naturalWidth - canvas.width, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
  return canvasImage(canvas);
}

export async function decodeDeckPortalQr(file: File): Promise<string> {
  validateQrImage(file);
  const objectUrl = URL.createObjectURL(file);
  try {
    const image = await loadImage(objectUrl);
    if (image.naturalWidth * image.naturalHeight > maxPixels) throw new Error('画像の総画素数が大きすぎます。');
    const reader = new BrowserQRCodeReader();
    const attempts: HTMLImageElement[] = [image];
    const topRight = await topRightCandidate(image);
    if (topRight) attempts.push(topRight);
    for (const angle of [90, 180, 270]) {
      const canvas = document.createElement('canvas');
      const swapped = angle % 180 !== 0;
      canvas.width = swapped ? image.naturalHeight : image.naturalWidth;
      canvas.height = swapped ? image.naturalWidth : image.naturalHeight;
      const context = canvas.getContext('2d');
      if (!context) continue;
      context.translate(canvas.width / 2, canvas.height / 2);
      context.rotate((angle * Math.PI) / 180);
      context.drawImage(image, -image.naturalWidth / 2, -image.naturalHeight / 2);
      attempts.push(await canvasImage(canvas));
    }
    for (const candidate of attempts) {
      try {
        const text = await decodeImage(reader, candidate);
        validateDeckPortalUrl(text);
        return text;
      } catch { /* Try the next orientation. */ }
    }
    throw new Error('Deck Portal URLを含むQRコードを検出できませんでした。');
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
