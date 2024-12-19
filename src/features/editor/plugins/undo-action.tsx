import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { UNDO_COMMAND } from 'lexical';
import { Undo2 } from 'lucide-react';
import { useToolbarStore } from '../store/toolbar-context';
import { ToolbarButton } from '../ui/toolbar';

export function UndoPlugin() {
  const [editor] = useLexicalComposerContext();
  const canUndo = useToolbarStore((state) => state.canUndo);

  return (
    <ToolbarButton
      type='button'
      onClick={() => {
        editor.dispatchCommand(UNDO_COMMAND, undefined);
      }}
      disabled={!canUndo}
    >
      <Undo2 size={14} />
    </ToolbarButton>
  );
}
