import type { Knobs } from './shared';
import { color } from './theme';

export type MaterialFinish = 'original' | 'stone' | 'glaze' | 'linen';
export const materialStudyColors: Record<string, readonly [string, string, string]> = {
  'REF-031': ['#e3a366', '#f3dfba', '#bc6e55'],
  'REF-032': ['#e9d9bd', '#e8cf79', '#898348'],
  'REF-033': ['#e2ac95', '#b96148', '#efe2cf'],
  'REF-034': ['#e8d8bb', '#d68359', '#fff1d7'],
  'REF-035': ['#e1b59c', '#bd7154', '#d79a7c'],
  'REF-036': ['#cd896b', '#e9d18f', '#8c8551'],
};

// Match the linear-light material tint blend without importing Three into the shell.
function soften(hex: string) {
  const linear = (value: number) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  const srgb = (value: number) => value <= 0.0031308 ? value * 12.92 : 1.055 * value ** (1 / 2.4) - 0.055;
  return '#' + [1, 3, 5].map((offset) => {
    const base = linear(parseInt(hex.slice(offset, offset + 2), 16) / 255);
    const cream = linear(parseInt('#fffaf0'.slice(offset, offset + 2), 16) / 255);
    return Math.round(srgb(base * 0.48 + cream * 0.52) * 255).toString(16).padStart(2, '0');
  }).join('');
}

export function materialBaseColors(id: string, knobs: Knobs, finish: MaterialFinish = 'original') {
  const source = materialStudyColors[id] ?? materialStudyColors['REF-031'];
  const [cube, pyramid, sphere] = source.map((base, index) => {
    const tint = color(id === 'REF-034' && index === 2 && finish !== 'original' ? '#e8bd79' : base, knobs);
    return finish === 'original' ? tint : soften(tint);
  });
  return {
    cube, pyramid, sphere,
    backdrop: color('#f1e7d9', { ...knobs, depth: knobs.depth * 0.35 }),
    // Amber comes from transmission through this volume, not just the sphere's surface tint.
    amberAttenuation: id === 'REF-034' && finish === 'original' ? color('#d9a351', knobs) : null,
  };
}
