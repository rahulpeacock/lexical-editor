import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { FORMAT_TEXT_COMMAND } from 'lexical';
import { Bold } from 'lucide-react';
import { useToolbarStore } from '../store/toolbar-context';
import { ToolbarButton } from '../ui/toolbar';

export function TextBoldPlugin() {
  const [editor] = useLexicalComposerContext();
  const isBold = useToolbarStore((state) => state.isBold);

  return (
    <ToolbarButton
      type='button'
      onClick={() => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
      }}
      data-state={isBold ? 'active' : 'inactive'}
      aria-label='Format Bold'
    >
      <Bold size={14} />
    </ToolbarButton>
  );
}
