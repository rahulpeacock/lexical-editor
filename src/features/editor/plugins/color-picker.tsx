import { cn } from '@/lib/utils';
import { Alpha, Hue, Saturation } from '../common';
import { defaultPresetColors } from '../utils/config';
import SketchFields from './SketchFields';
import SketchPresetColors from './SketchPresetColors';

interface SketchProps {
  className?: string;
  rgb: { r: number; g: number; b: number; a: number };
  hex: string;
  hsv: { h: number; s: number; v: number };
  hsl: { h: number; s: number; l: number };
  presetColors?: string[];
  onChange: (color: any) => void;
  onSwatchHover: (color: any) => void;
}

export function Sketch({ className, rgb, hex, hsv, hsl, presetColors = defaultPresetColors, onChange, onSwatchHover }: SketchProps) {
  return (
    <div className={cn('w-52 ', className)}>
      <div className='w-full pb-[75%] relative overflow-hidden'>
        <Saturation className='rounded-[3px]' hsl={hsl} hsv={hsv} onChange={onChange} />
      </div>
      <div className='flex'>
        <div className='flex-1 py-1'>
          <div className='relative h-2.5 overflow-hidden'>
            <Hue className='rounded-[2px]' hsl={hsl} onChange={onChange} />
          </div>
          <div className='relative h-2.5 mt-1 overflow-hidden'>
            <Alpha className='rounded-[2px]' rgb={rgb} hsl={hsl} onChange={onChange} />
          </div>
        </div>
        <div className='size-6 relative mt-1 ml-1 rounded-[3px]'>
          <div style={{ background: `rgba(${rgb.r},${rgb.g},${rgb.b},${rgb.a})` }} className='rounded-[2px] ' />
        </div>
      </div>
      <SketchFields rgb={rgb} hsl={hsl} hex={hex} onChange={onChange} />
      <SketchPresetColors colors={presetColors} onClick={onChange} onSwatchHover={onSwatchHover} />
    </div>
  );
}
