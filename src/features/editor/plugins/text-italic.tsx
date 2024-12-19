import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { FORMAT_TEXT_COMMAND } from 'lexical';
import { Italic } from 'lucide-react';
import { useToolbarStore } from '../store/toolbar-context';
import { ToolbarButton } from '../ui/toolbar';

export function TextItalicPlugin() {
  const [editor] = useLexicalComposerContext();
  const isItalic = useToolbarStore((state) => state.isItalic);

  return (
    <ToolbarButton
      type='button'
      onClick={() => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
      }}
      data-state={isItalic ? 'active' : 'inactive'}
      aria-label='Format Italic'
    >
      <Italic size={14} />
    </ToolbarButton>
  );
}
