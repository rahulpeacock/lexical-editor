import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { FORMAT_TEXT_COMMAND } from 'lexical';
import { Strikethrough } from 'lucide-react';
import { useToolbarStore } from '../store/toolbar-context';
import { ToolbarButton } from '../ui/toolbar';

export function TextStrikethroughPlugin() {
  const [editor] = useLexicalComposerContext();
  const isStrikethrough = useToolbarStore((state) => state.isStrikethrough);

  return (
    <ToolbarButton
      type='button'
      onClick={() => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
      }}
      data-state={isStrikethrough ? 'active' : 'inactive'}
      aria-label='Format Strikethrough'
    >
      <Strikethrough size={14} />
    </ToolbarButton>
  );
}
