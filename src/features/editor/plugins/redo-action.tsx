import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { REDO_COMMAND } from 'lexical';
import { Redo2 } from 'lucide-react';
import { useToolbarStore } from '../store/toolbar-context';
import { ToolbarButton } from '../ui/toolbar';

export function RedoPlugin() {
  const [editor] = useLexicalComposerContext();
  const canRedo = useToolbarStore((state) => state.canRedo);

  return (
    <ToolbarButton
      type='button'
      onClick={() => {
        editor.dispatchCommand(REDO_COMMAND, undefined);
      }}
      disabled={!canRedo}
    >
      <Redo2 size={14} />
    </ToolbarButton>
  );
}
