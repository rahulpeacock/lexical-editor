interface RGB {
  b: number;
  g: number;
  r: number;
}
interface HSV {
  h: number;
  s: number;
  v: number;
}
interface Color {
  hex: string;
  hsv: HSV;
  rgb: RGB;
}

export function clamp(value: number, max: number, min: number) {
  return value > max ? max : value < min ? min : value;
}

export function toHex(value: string): string {
  if (!value.startsWith('#')) {
    const ctx = document.createElement('canvas').getContext('2d');

    if (!ctx) {
      throw new Error('2d context not supported or canvas already initialized');
    }

    ctx.fillStyle = value;

    return ctx.fillStyle;
  }

  if (value.length === 4 || value.length === 5) {
    const val = value
      .split('')
      .map((v, i) => (i ? v + v : '#'))
      .join('');

    return val;
  }

  if (value.length === 7 || value.length === 9) {
    return value;
  }

  return '#000000';
}

function hex2rgb(hex: string): RGB {
  const rbgArr = (
    hex
      .replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (_, r, g, b) => `#${r}${r}${g}${g}${b}${b}`)
      .substring(1)
      .match(/.{2}/g) || []
  ).map((x) => Number.parseInt(x, 16));

  return {
    b: rbgArr[2],
    g: rbgArr[1],
    r: rbgArr[0],
  };
}

function rgb2hsv({ r, g, b }: RGB): HSV {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const d = max - Math.min(r, g, b);

  const h = d ? (max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? 2 + (b - r) / d : 4 + (r - g) / d) * 60 : 0;
  const s = max ? (d / max) * 100 : 0;
  const v = max * 100;

  return { h, s, v };
}

export function hsv2rgb({ h, s, v }: HSV): RGB {
  s /= 100;
  v /= 100;

  const i = ~~(h / 60);
  const f = h / 60 - i;
  const p = v * (1 - s);
  const q = v * (1 - s * f);
  const t = v * (1 - s * (1 - f));
  const index = i % 6;

  const r = Math.round([v, q, p, p, t, v][index] * 255);
  const g = Math.round([t, v, v, q, p, p][index] * 255);
  const b = Math.round([p, p, t, v, v, q][index] * 255);

  return { b, g, r };
}

export function rgb2hex({ b, g, r }: RGB): string {
  return `#${[r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')}`;
}

export function transformColor<M extends keyof Color, C extends Color[M]>(format: M, color: C): Color {
  let hex: Color['hex'] = toHex('#121212');
  let rgb: Color['rgb'] = hex2rgb(hex);
  let hsv: Color['hsv'] = rgb2hsv(rgb);

  if (format === 'hex') {
    const value = color as Color['hex'];

    hex = toHex(value);
    rgb = hex2rgb(hex);
    hsv = rgb2hsv(rgb);
  } else if (format === 'rgb') {
    const value = color as Color['rgb'];

    rgb = value;
    hex = rgb2hex(rgb);
    hsv = rgb2hsv(rgb);
  } else if (format === 'hsv') {
    const value = color as Color['hsv'];

    hsv = value;
    rgb = hsv2rgb(hsv);
    hex = rgb2hex(rgb);
  }

  return { hex, hsv, rgb };
}

export const opaque = [
  'FF',
  'FC',
  'FA',
  'F7',
  'F5',
  'F2',
  'F0',
  'ED',
  'EB',
  'E8',
  'E6',
  'E3',
  'E0',
  'DE',
  'DB',
  'D9',
  'D6',
  'D4',
  'D1',
  'CF',
  'CC',
  'C9',
  'C7',
  'C4',
  'C2',
  'BF',
  'BD',
  'BA',
  'B8',
  'B5',
  'B3',
  'B0',
  'AD',
  'AB',
  'A8',
  'A6',
  'A3',
  'A1',
  '9E',
  '9C',
  '99',
  '96',
  '94',
  '91',
  '8F',
  '8C',
  '8A',
  '87',
  '85',
  '82',
  '80',
  '7D',
  '7A',
  '78',
  '75',
  '73',
  '70',
  '6E',
  '6B',
  '69',
  '66',
  '63',
  '61',
  '5E',
  '5C',
  '59',
  '57',
  '54',
  '52',
  '4F',
  '4D',
  '4A',
  '47',
  '45',
  '42',
  '40',
  '3D',
  '3B',
  '38',
  '36',
  '33',
  '30',
  '2E',
  '2B',
  '29',
  '26',
  '24',
  '21',
  '1F',
  '1C',
  '1A',
  '17',
  '14',
  '12',
  '0F',
  '0D',
  '0A',
  '08',
  '05',
  '03',
  '00',
];
