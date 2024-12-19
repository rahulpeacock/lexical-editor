import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { FORMAT_TEXT_COMMAND } from 'lexical';
import { Superscript } from 'lucide-react';
import React from 'react';

interface TextSuperscriptPluginProps extends React.ComponentPropsWithoutRef<'button'> {}

export const TextSuperscriptPlugin = React.forwardRef<HTMLButtonElement, TextSuperscriptPluginProps>(({ onClick, ...props }, ref) => {
  const [editor] = useLexicalComposerContext();

  return (
    <button
      ref={ref}
      type='button'
      onClick={(e) => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'superscript');
        onClick?.(e);
      }}
      {...props}
    >
      <Superscript size={14} /> Superscript
    </button>
  );
});
