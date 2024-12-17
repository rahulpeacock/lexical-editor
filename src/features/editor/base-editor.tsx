import { ListItemNode, ListNode } from '@lexical/list';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { QuoteNode } from '@lexical/rich-text';
import { editorTheme } from './editor-theme';
import { ToolbarPlugin } from './plugins/toolbar';

function onError(error: Error) {
  console.error(error);
}

export function BaseEditor() {
  const initialConfig = {
    namespace: 'MyEditor',
    theme: editorTheme,
    onError,
    nodes: [ListNode, ListItemNode, QuoteNode],
  };

  return (
    <div>
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin />
        <RichTextPlugin
          contentEditable={<ContentEditable className='focus:outline-none px-8' />}
          placeholder={<div>Enter some text...</div>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <AutoFocusPlugin />
        <ListPlugin />
      </LexicalComposer>
    </div>
  );
}
