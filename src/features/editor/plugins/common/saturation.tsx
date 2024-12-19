import throttle from 'lodash/throttle';
import React, { Component, PureComponent } from 'react';
import * as saturation from '../../helpers/saturation';

export class Saturation extends (PureComponent || Component) {
  constructor(props) {
    super(props);

    this.throttle = throttle((fn, data, e) => {
      fn(data, e);
    }, 50);
  }

  componentWillUnmount() {
    this.throttle.cancel();
    this.unbindEventListeners();
  }

  getContainerRenderWindow() {
    const { container } = this;
    let renderWindow = window;
    while (!renderWindow.document.contains(container) && renderWindow.parent !== renderWindow) {
      renderWindow = renderWindow.parent;
    }
    return renderWindow;
  }

  handleChange = (e) => {
    typeof this.props.onChange === 'function' && this.throttle(this.props.onChange, saturation.calculateChange(e, this.props.hsl, this.container), e);
  };

  handleMouseDown = (e) => {
    this.handleChange(e);
    const renderWindow = this.getContainerRenderWindow();
    renderWindow.addEventListener('mousemove', this.handleChange);
    renderWindow.addEventListener('mouseup', this.handleMouseUp);
  };

  handleMouseUp = () => {
    this.unbindEventListeners();
  };

  unbindEventListeners() {
    const renderWindow = this.getContainerRenderWindow();
    renderWindow.removeEventListener('mousemove', this.handleChange);
    renderWindow.removeEventListener('mouseup', this.handleMouseUp);
  }
}

interface SaturationProps {
  hsl: { h: number; s: number; l: number };
  hsv: { h: number; s: number; v: number };
}

export function FSaturation({ hsl, hsv }: SaturationProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const getContainerRenderWindow = () => {
    const container = containerRef.current;
    let renderWindow = window;
    while (!renderWindow.document.contains(container) && renderWindow.parent !== renderWindow) {
      renderWindow = renderWindow.parent;
    }
    return renderWindow;
  };

  const handleChange = (e: React.TouchEvent<HTMLDivElement> | MouseEvent) => {
    typeof this.props.onChange === 'function' && this.throttle(this.props.onChange, saturation.calculateChange(e, hsl, containerRef.current), e);
  };

  const unbindEventListeners = () => {
    const renderWindow = getContainerRenderWindow();
    renderWindow.removeEventListener('mousemove', handleChange);
    renderWindow.removeEventListener('mouseup', handleMouseUp);
  };

  const handleMouseUp = () => {
    unbindEventListeners();
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    handleChange(e as unknown as React.TouchEvent<HTMLDivElement>);
    const renderWindow = getContainerRenderWindow();
    renderWindow.addEventListener('mousemove', handleChange);
    renderWindow.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      style={{ background: `hsl(${hsl.h},100%, 50%)` }}
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onTouchMove={handleChange}
      onTouchStart={handleChange}
    >
      <style>{`
      .saturation-white {
        background: -webkit-linear-gradient(to right, #fff, rgba(255,255,255,0));
        background: linear-gradient(to right, #fff, rgba(255,255,255,0));
      }
      .saturation-black {
        background: -webkit-linear-gradient(to top, #000, rgba(0,0,0,0));
        background: linear-gradient(to top, #000, rgba(0,0,0,0));
      }
    `}</style>
      <div className='saturation-white'>
        <div className='saturation-black' />
        <div style={{ top: `${-(hsv.v * 100) + 100}%`, left: `${hsv.s * 100}%` }} className='absolute cursor-default'>
          <div className='size-1 rounded-full cursor-grabbing' />
        </div>
      </div>
    </div>
  );
}
