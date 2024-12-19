import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { INSERT_UNORDERED_LIST_COMMAND, insertList } from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $findMatchingParent, mergeRegister } from '@lexical/utils';
import {
  $getSelection,
  $isElementNode,
  $isLineBreakNode,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  type LexicalNode,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';
import { ChevronDown, Ellipsis } from 'lucide-react';
import React from 'react';
import { useToolbarStore } from '../store/toolbar-context';
import { ToolbarButton, ToolbarGroup } from '../ui/toolbar';
import { getSelectedNode } from '../utils/get-selected-node';
import { BgColorPlugin } from './bg-color';
import { FontColorPlugin } from './font-color';
import { ImagePlugin } from './image';
import { LinkPlugin } from './link';
import { NumberList } from './number-list';
import { RedoPlugin } from './redo-action';
import { TablePlugin } from './table';
import { TextAlignPlugin } from './text-align';
import { TextBoldPlugin } from './text-bold';
import { TextCodePlugin } from './text-code';
import { TextItalicPlugin } from './text-italic';
import { TextKbdPlugin } from './text-kbd';
import { TextStrikethroughPlugin } from './text-strikethrough';
import { TextSubscriptPlugin } from './text-subscript';
import { TextSuperscriptPlugin } from './text-superscript';
import { TextUnderlinePlugin } from './text-underline';
import { TodoList } from './todo-list';
import { ToggleList } from './toggle-list';
import { UndoPlugin } from './undo-action';
import { UnorderedList } from './unordered-list';

const LowPriority = 1;

export function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const updateToolbar = useToolbarStore((state) => state.updateToolbar);

  const $updateToolbar = React.useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // Update text format
      updateToolbar('isBold', selection.hasFormat('bold'));
      updateToolbar('isItalic', selection.hasFormat('italic'));
      updateToolbar('isUnderline', selection.hasFormat('underline'));
      updateToolbar('isStrikethrough', selection.hasFormat('strikethrough'));
      updateToolbar('isCode', selection.hasFormat('code'));

      const node = getSelectedNode(selection);
      const parent = node.getParent();

      let matchingParent: LexicalNode | null = null;
      if ($isLineBreakNode(parent)) {
        // If node is a link, we need to fetch the parent paragraph node to set format
        matchingParent = $findMatchingParent(node, (parentNode) => $isElementNode(parentNode) && !parentNode.isInline());
      }

      // Update textalign
      updateToolbar(
        'textAlign',
        $isElementNode(matchingParent)
          ? matchingParent.getFormatType()
          : $isElementNode(node)
            ? node.getFormatType()
            : parent?.getFormatType() || 'left',
      );
    }
  }, [updateToolbar]);

  React.useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, _newEditor) => {
          $updateToolbar();
          return false;
        },
        LowPriority,
      ),
      editor.registerCommand(
        INSERT_UNORDERED_LIST_COMMAND,
        () => {
          insertList(editor, 'bullet');
          return true;
        },
        LowPriority,
      ),
      editor.registerCommand<boolean>(
        CAN_UNDO_COMMAND,
        (payload) => {
          updateToolbar('canUndo', payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
      editor.registerCommand<boolean>(
        CAN_REDO_COMMAND,
        (payload) => {
          updateToolbar('canRedo', payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
    );
  }, [editor, $updateToolbar, updateToolbar]);

  return (
    <div className='flex items-center justify-start border-b h-10 mb-6'>
      <ToolbarGroup>
        <UndoPlugin />
        <RedoPlugin />
      </ToolbarGroup>

      <ToolbarGroup>
        <ToolbarButton type='button' className='min-w-28'>
          Normal text <ChevronDown className='ml-auto' size={14} />
        </ToolbarButton>
      </ToolbarGroup>

      <ToolbarGroup>
        <TextBoldPlugin />
        <TextItalicPlugin />
        <TextUnderlinePlugin />
        <TextStrikethroughPlugin />
        <TextCodePlugin />
        <FontColorPlugin />
        <BgColorPlugin />
      </ToolbarGroup>

      <ListToolbarItems />

      <ToolbarGroup>
        <LinkPlugin />
        <TextAlignPlugin />
        <TablePlugin />
        <ImagePlugin />
      </ToolbarGroup>

      <ToolbarGroup className='border-r-0'>
        <MoreTools />
      </ToolbarGroup>
    </div>
  );
}

function ListToolbarItems() {
  return (
    <ToolbarGroup>
      <UnorderedList />
      <NumberList />
      <TodoList />
      <ToggleList />
    </ToolbarGroup>
  );
}

function MoreTools() {
  const [editor] = useLexicalComposerContext();

  function handleCloseAutoFocus(e: Event) {
    e.preventDefault();
    editor.focus();
  }

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <ToolbarButton type='button'>
            <Ellipsis size={14} />
          </ToolbarButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent onCloseAutoFocus={handleCloseAutoFocus} className='w-40'>
          <DropdownMenuItem className='cursor-pointer w-full' asChild>
            <TextKbdPlugin />
          </DropdownMenuItem>
          <DropdownMenuItem className='cursor-pointer w-full' asChild>
            <TextSuperscriptPlugin />
          </DropdownMenuItem>
          <DropdownMenuItem className='cursor-pointer w-full' asChild>
            <TextSubscriptPlugin />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
