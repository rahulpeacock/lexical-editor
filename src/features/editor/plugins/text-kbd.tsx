import { Keyboard } from 'lucide-react';
import React from 'react';

interface TextKbdPluginProps extends React.ComponentPropsWithoutRef<'button'> {}

export const TextKbdPlugin = React.forwardRef<HTMLButtonElement, TextKbdPluginProps>(({ onClick, ...props }, ref) => {
  return (
    <button
      ref={ref}
      type='button'
      onClick={(e) => {
        // editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript');
        console.log('TextKbd');
        onClick?.(e);
      }}
      {...props}
    >
      <Keyboard size={14} /> Keyboard
    </button>
  );
});
