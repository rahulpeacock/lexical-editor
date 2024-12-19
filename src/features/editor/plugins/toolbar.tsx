import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
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
  type ElementFormatType,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  type LexicalNode,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Baseline,
  ChevronDown,
  Ellipsis,
  Image,
  Keyboard,
  Link,
  List,
  ListCollapse,
  ListOrdered,
  ListTodo,
  PaintBucket,
  Subscript,
  Superscript,
  Table,
} from 'lucide-react';
import React from 'react';
import { useToolbarStore } from '../store/toolbar-context';
import { ToolbarButton, ToolbarGroup } from '../ui/toolbar';
import { getSelectedNode } from '../utils/get-selected-node';
import { RedoPlugin } from './redo-action';
import { ColorPicker } from './test/color-picker';
import { TextBoldPlugin } from './text-bold';
import { TextCodePlugin } from './text-code';
import { TextItalicPlugin } from './text-italic';
import { TextStrikethroughPlugin } from './text-strikethrough';
import { TextUnderlinePlugin } from './text-underline';
import { UndoPlugin } from './undo-action';

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
      </ToolbarGroup>

      <ListToolbarItems />

      <ToolbarGroup>
        <ToolbarButton type='button'>
          <Link size={14} />
        </ToolbarButton>
        <TextAlignToolbar />
        <ToolbarButton type='button' className='gap-1'>
          <Table size={14} /> <ChevronDown size={14} />
        </ToolbarButton>
        <ToolbarButton type='button' className='gap-1'>
          <Image size={14} /> <ChevronDown size={14} />
        </ToolbarButton>
      </ToolbarGroup>

      <MoreToolbarItems />
    </div>
  );
}

function InlineToolbarItems() {
  const bgColor = useToolbarStore((state) => state.bgColor);

  return (
    <ToolbarGroup>
      <FontColorPicker />
      <ToolbarButton type='button' onClick={() => console.log('bgColor: ', bgColor)}>
        <PaintBucket size={14} />
      </ToolbarButton>
    </ToolbarGroup>
  );
}

function FontColorPicker() {
  const fontColor = useToolbarStore((state) => state.fontColor);

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <ToolbarButton type='button' onClick={() => console.log('fontColor: ', fontColor)}>
            <Baseline size={14} />
          </ToolbarButton>
        </PopoverTrigger>
        <PopoverContent className='p-3 w-max'>
          <ColorPicker color='#121212FF' onChange={(value) => console.log(value)} />
        </PopoverContent>
      </Popover>
    </div>
  );
}

function ListToolbarItems() {
  const [editor] = useLexicalComposerContext();

  return (
    <ToolbarGroup>
      <ToolbarButton
        type='button'
        onClick={() => {
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
        }}
      >
        <List size={14} />
      </ToolbarButton>
      <ToolbarButton type='button'>
        <ListOrdered size={14} />
      </ToolbarButton>
      <ToolbarButton type='button'>
        <ListTodo size={14} />
      </ToolbarButton>
      <ToolbarButton type='button'>
        <ListCollapse size={14} />
      </ToolbarButton>
    </ToolbarGroup>
  );
}

const TextFormatIcons: Record<ElementFormatType, JSX.Element> = {
  left: <AlignLeft size={14} />,
  center: <AlignCenter size={14} />,
  right: <AlignRight size={14} />,
  justify: <AlignJustify size={14} />,
  start: <AlignLeft size={14} />,
  end: <AlignRight size={14} />,
  '': <AlignLeft size={14} />,
};

function TextAlignToolbar() {
  const [editor] = useLexicalComposerContext();
  const textAlign = useToolbarStore((state) => state.textAlign);

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <ToolbarButton type='button' className='gap-1'>
            {TextFormatIcons[textAlign]} <ChevronDown size={14} />
          </ToolbarButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className='min-w-max'
          onCloseAutoFocus={(e) => {
            e.preventDefault();
            editor.focus();
          }}
        >
          <DropdownMenuItem
            className='hover:cursor-pointer'
            onClick={() => {
              editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
            }}
          >
            <AlignLeft size={14} />
          </DropdownMenuItem>
          <DropdownMenuItem
            className='hover:cursor-pointer'
            onClick={() => {
              editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
            }}
          >
            <AlignCenter size={14} />
          </DropdownMenuItem>
          <DropdownMenuItem
            className='hover:cursor-pointer'
            onClick={() => {
              editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
            }}
          >
            <AlignRight size={14} />
          </DropdownMenuItem>
          <DropdownMenuItem
            className='hover:cursor-pointer'
            onClick={() => {
              editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify');
            }}
          >
            <AlignJustify size={14} />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function MoreToolbarItems() {
  const [editor] = useLexicalComposerContext();

  return (
    <ToolbarGroup className='border-r-0'>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <ToolbarButton type='button'>
              <Ellipsis size={14} />
            </ToolbarButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            onCloseAutoFocus={(e) => {
              e.preventDefault();
              editor.focus();
            }}
            className='w-40'
          >
            <DropdownMenuItem>
              <Keyboard size={14} /> Keyboard
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'superscript');
              }}
            >
              <Superscript size={14} />
              Superscript
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript');
              }}
            >
              <Subscript size={14} />
              Subscript
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </ToolbarGroup>
  );
}
