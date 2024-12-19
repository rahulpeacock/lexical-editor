import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { FORMAT_TEXT_COMMAND } from 'lexical';
import { CodeXml } from 'lucide-react';
import { useToolbarStore } from '../store/toolbar-context';
import { ToolbarButton } from '../ui/toolbar';

export function TextCodePlugin() {
  const [editor] = useLexicalComposerContext();
  const isCode = useToolbarStore((state) => state.isCode);

  return (
    <ToolbarButton
      type='button'
      onClick={() => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
      }}
      data-state={isCode ? 'active' : 'inactive'}
      aria-label='Format Code'
    >
      <CodeXml size={14} />
    </ToolbarButton>
  );
}
