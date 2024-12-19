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

type Alpha = {
  alpha: number;
  opaque: string;
};

export function transformOpaque(hex: string): Alpha {
  if (hex.length === 9) {
    return { alpha: opaque.indexOf(hex.slice(7)), opaque: hex.slice(7) };
  }
  return { alpha: 100, opaque: 'FF' };
}

export function transformAlpha(alpha: number): Alpha {
  return { alpha, opaque: opaque[alpha] };
}

export const opaque = [
  '00',
  '03',
  '05',
  '08',
  '0A',
  '0D',
  '0F',
  '12',
  '14',
  '17',
  '1A',
  '1C',
  '1F',
  '21',
  '24',
  '26',
  '29',
  '2B',
  '2E',
  '30',
  '33',
  '36',
  '38',
  '3B',
  '3D',
  '40',
  '42',
  '45',
  '47',
  '4A',
  '4D',
  '4F',
  '52',
  '54',
  '57',
  '59',
  '5C',
  '5E',
  '61',
  '63',
  '66',
  '69',
  '6B',
  '6E',
  '70',
  '73',
  '75',
  '78',
  '7A',
  '7D',
  '80',
  '82',
  '85',
  '87',
  '8A',
  '8C',
  '8F',
  '91',
  '94',
  '96',
  '99',
  '9C',
  '9E',
  'A1',
  'A3',
  'A6',
  'A8',
  'AB',
  'AD',
  'B0',
  'B3',
  'B5',
  'B8',
  'BA',
  'BD',
  'BF',
  'C2',
  'C4',
  'C7',
  'C9',
  'CC',
  'CF',
  'D1',
  'D4',
  'D6',
  'D9',
  'DB',
  'DE',
  'E0',
  'E3',
  'E6',
  'E8',
  'EB',
  'ED',
  'F0',
  'F2',
  'F5',
  'F7',
  'FA',
  'FC',
  'FF',
];
