import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { FORMAT_TEXT_COMMAND } from 'lexical';
import { Underline } from 'lucide-react';
import { useToolbarStore } from '../store/toolbar-context';
import { ToolbarButton } from '../ui/toolbar';

export function TextUnderlinePlugin() {
  const [editor] = useLexicalComposerContext();
  const isUnderline = useToolbarStore((state) => state.isUnderline);

  return (
    <ToolbarButton
      type='button'
      onClick={() => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
      }}
      data-state={isUnderline ? 'active' : 'inactive'}
      aria-label='Format Underline'
    >
      <Underline size={14} />
    </ToolbarButton>
  );
}
