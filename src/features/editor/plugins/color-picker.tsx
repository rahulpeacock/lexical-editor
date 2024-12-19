import './color-picker.css';

import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { calculateZoomLevel } from '@lexical/utils';
import { useEffect, useMemo, useRef, useState } from 'react';
import React from 'react';
import { clamp, transformAlpha, transformColor, transformOpaque } from '../utils/color';

let skipAddingToHistoryStack = false;

interface ColorPickerProps {
  color: string;
  onChange?: (value: string, skipHistoryStack: boolean) => void;
}

export function parseAllowedColor(input: string) {
  return /^rgb\(\d+, \d+, \d+\)$/.test(input) ? input : '';
}

const basicColors = [
  '#d0021b',
  '#f5a623',
  '#f8e71c',
  '#8b572a',
  '#7ed321',
  '#417505',
  '#bd10e0',
  '#9013fe',
  '#4a90e2',
  '#50e3c2',
  '#b8e986',
  '#000000',
  '#4a4a4a',
  '#9b9b9b',
  '#bd10e0',
  '#9013fe',
  '#4a90e2',
  '#50e3c2',
  '#b8e986',
  '#000000',
  '#4a4a4a',
  '#50e3c2',
  '#000000',
  '#4a4a4a',
  '#9b9b9b',
  '#bd10e0',
  '#9013fe',
  '#4a90e2',
  '#50e3c2',
  '#b8e986',
  '#000000',
  '#4a4a4a',
  '#50e3c2',
];

const WIDTH = 254;
const SLIDER_WIDTH = 216;
const HEIGHT = 150;
const HUE_OFFSET = 8;

export function ColorPicker({ color, onChange }: Readonly<ColorPickerProps>): JSX.Element {
  const [selfColor, setSelfColor] = useState(transformColor('hex', color));
  const [selfAlpha, setSelfAlpha] = useState(transformOpaque(color));
  const [inputColor, setInputColor] = useState(color);
  const innerDivRef = useRef(null);

  const saturationPosition = useMemo(
    () => ({
      x: (selfColor.hsv.s / 100) * WIDTH,
      y: ((100 - selfColor.hsv.v) / 100) * HEIGHT,
    }),
    [selfColor.hsv.s, selfColor.hsv.v],
  );

  const huePosition = useMemo(
    () => ({
      x: (selfColor.hsv.h / 360) * SLIDER_WIDTH,
    }),
    [selfColor.hsv],
  );

  const alphaPosition = useMemo(
    () => ({
      x: (selfAlpha.alpha / 100) * SLIDER_WIDTH,
    }),
    [selfAlpha],
  );

  const onSetHex = (hex: string) => {
    setInputColor(hex);
    if (/^#[0-9A-Fa-f]{6}$/i.test(hex)) {
      const newColor = transformColor('hex', hex);
      setSelfColor(newColor);
    }
  };

  const onMoveSaturation = ({ x, y }: Position) => {
    const newHsv = {
      ...selfColor.hsv,
      s: (x / WIDTH) * 100,
      v: 100 - (y / HEIGHT) * 100,
    };
    const newColor = transformColor('hsv', newHsv);
    setSelfColor(newColor);
    setInputColor(newColor.hex);
  };

  const onMoveHue = ({ x }: Position) => {
    const newHsv = { ...selfColor.hsv, h: (x / (SLIDER_WIDTH - HUE_OFFSET)) * 360 };
    const newColor = transformColor('hsv', newHsv);

    setSelfColor(newColor);
    setInputColor(newColor.hex);
  };

  const onMoveAlpha = ({ x }: Position) => {
    const alpha = Math.round((x / (SLIDER_WIDTH - HUE_OFFSET)) * 100);
    const newAlpha = transformAlpha(alpha);
    setSelfAlpha(newAlpha);
  };

  useEffect(() => {
    // Check if the dropdown is actually active
    if (innerDivRef.current !== null && onChange) {
      onChange(selfColor.hex, skipAddingToHistoryStack);
      setInputColor(selfColor.hex);
    }
  }, [selfColor, onChange]);

  useEffect(() => {
    if (color === undefined) {
      return;
    }
    const newColor = transformColor('hex', color);
    setSelfColor(newColor);
    setInputColor(newColor.hex);
  }, [color]);

  return (
    <div ref={innerDivRef} style={{ width: WIDTH }}>
      <MoveWrapper
        className='color-picker-saturation w-full relative h-[150px] select-none shadow-xl'
        style={{ backgroundColor: `hsl(${selfColor.hsv.h}, 100%, 50%)` }}
        onChange={onMoveSaturation}
      >
        <div
          className='absolute size-4 rounded-full border-4 border-white -translate-x-2 -translate-y-2'
          style={{
            backgroundColor: selfColor.hex,
            left: saturationPosition.x,
            top: saturationPosition.y,
          }}
        />
      </MoveWrapper>
      <div className='flex items-center justify-start gap-2 pt-3'>
        <div className='w-full space-y-1.5'>
          <MoveWrapper className='color-picker-hue select-none w-full relative h-3' offset={HUE_OFFSET} onChange={onMoveHue}>
            <div
              className='absolute w-1.5 bg-white h-2.5 translate-x-px translate-y-px shadow'
              style={{
                left: Math.max(0, huePosition.x - HUE_OFFSET),
              }}
            />
          </MoveWrapper>
          <MoveWrapper
            style={{
              backgroundImage:
                'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAADFJREFUOE9jZGBgEGHAD97gk2YcNYBhmIQBgWSAP52AwoAQwJvQRg1gACckQoC2gQgAIF8IscwEtKYAAAAASUVORK5CYII=")',
            }}
            className='select-none w-full relative h-3 bg-[left_center]'
            offset={HUE_OFFSET}
            onChange={onMoveAlpha}
          >
            <React.Fragment>
              <div
                className='absolute w-1.5 bg-white h-2.5 translate-x-px translate-y-px shadow z-20'
                style={{
                  left: Math.max(0, alphaPosition.x - HUE_OFFSET),
                }}
              />
              <div style={{ backgroundImage: `linear-gradient(to right, transparent, ${selfColor.hex})` }} className='absolute select-none inset-0' />
            </React.Fragment>
          </MoveWrapper>
        </div>
        <div className='w-[30px] relative'>
          <div className='size-[30px] rounded-[2px] relative z-20 shadow' style={{ backgroundColor: `${selfColor.hex}${selfAlpha.opaque}` }} />
          <div
            style={{
              backgroundImage:
                'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAADFJREFUOE9jZGBgEGHAD97gk2YcNYBhmIQBgWSAP52AwoAQwJvQRg1gACckQoC2gQgAIF8IscwEtKYAAAAASUVORK5CYII=")',
            }}
            className='size-[30px] rounded-[2px] absolute inset-0 z-10'
          />
        </div>
      </div>

      <div className='py-3 flex items-center justify-start'>
        <p className='text-xs mr-2.5'>Hex</p>
        <Input
          className='p-0 h-6 px-2 rounded-none rounded-l-md flex-grow focus-visible:ring-0'
          onChange={(e) => onSetHex(e.target.value)}
          value={inputColor}
        />
        <div className='relative w-24'>
          <Input
            type='number'
            min={0}
            max={100}
            className='p-0 h-6 pl-2 pr-5 rounded-none rounded-r-md border-l-transparent w-full tabular-nums text-right focus-visible:ring-0'
            onChange={(e) => setSelfAlpha(transformAlpha(Number(e.target.value)))}
            value={selfAlpha.alpha}
          />
          <span className='absolute right-2 top-[3px] text-sm'>%</span>
        </div>
      </div>
      <Separator />
      <div className='flex flex-wrap gap-1.5 justify-between pt-3'>
        {basicColors.map((basicColor, index) => (
          <button
            type='button'
            className={'size-4 hover:cursor-pointer rounded-[20%] data-[active=true]:ring data-[active]:ring-foreground/30'}
            key={`${basicColor}-${
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              index
            }`}
            style={{ backgroundColor: basicColor }}
            onClick={() => {
              setInputColor(basicColor);
              setSelfColor(transformColor('hex', basicColor));
            }}
            data-active={basicColor === selfColor.hex}
          />
        ))}
      </div>
    </div>
  );
}

export interface Position {
  x: number;
  y: number;
}

interface MoveWrapperProps {
  className?: string;
  style?: React.CSSProperties;
  onChange: (position: Position) => void;
  children: JSX.Element;
  offset?: number;
}

function MoveWrapper({ className, style, offset = 0, onChange, children }: MoveWrapperProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const draggedRef = useRef(false);

  const move = (e: React.MouseEvent | MouseEvent): void => {
    if (divRef.current) {
      const { current: div } = divRef;
      const { width, height, left, top } = div.getBoundingClientRect();
      const zoom = calculateZoomLevel(div);
      const x = clamp(e.clientX / zoom - left, width, 0) - offset;
      const y = clamp(e.clientY / zoom - top, height, 0);

      onChange({ x: x < 0 ? 0 : x, y });
    }
  };

  const onMouseDown = (e: React.MouseEvent): void => {
    if (e.button !== 0) {
      return;
    }

    move(e);

    const onMouseMove = (_e: MouseEvent): void => {
      draggedRef.current = true;
      skipAddingToHistoryStack = true;
      move(_e);
    };

    const onMouseUp = (_e: MouseEvent): void => {
      if (draggedRef.current) {
        skipAddingToHistoryStack = false;
      }

      document.removeEventListener('mousemove', onMouseMove, false);
      document.removeEventListener('mouseup', onMouseUp, false);

      move(_e);
      draggedRef.current = false;
    };

    document.addEventListener('mousemove', onMouseMove, false);
    document.addEventListener('mouseup', onMouseUp, false);
  };

  return (
    <div ref={divRef} className={className} style={style} onMouseDown={onMouseDown}>
      {children}
    </div>
  );
}
