import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { FORMAT_TEXT_COMMAND } from 'lexical';
import { Subscript } from 'lucide-react';
import React from 'react';

interface TextSubscriptPluginProps extends React.ComponentPropsWithoutRef<'button'> {}

export const TextSubscriptPlugin = React.forwardRef<HTMLButtonElement, TextSubscriptPluginProps>(({ onClick, ...props }, ref) => {
  const [editor] = useLexicalComposerContext();

  return (
    <button
      ref={ref}
      type='button'
      onClick={(e) => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript');
        onClick?.(e);
      }}
      {...props}
    >
      <Subscript size={14} /> Subscript
    </button>
  );
});
