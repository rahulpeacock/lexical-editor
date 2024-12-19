import { INSERT_UNORDERED_LIST_COMMAND } from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { List } from 'lucide-react';
import { ToolbarButton } from '../ui/toolbar';

export function UnorderedList() {
  const [editor] = useLexicalComposerContext();

  return (
    <ToolbarButton
      type='button'
      onClick={() => {
        editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
      }}
    >
      <List size={14} />
    </ToolbarButton>
  );
}
