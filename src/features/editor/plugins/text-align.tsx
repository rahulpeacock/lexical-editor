import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { type ElementFormatType, FORMAT_ELEMENT_COMMAND } from 'lexical';
import { AlignCenter, AlignJustify, AlignLeft, AlignRight, ChevronDown } from 'lucide-react';
import { useToolbarStore } from '../store/toolbar-context';
import { ToolbarButton } from '../ui/toolbar';

const textFormatIcons: Partial<Record<ElementFormatType, JSX.Element>> = {
  left: <AlignLeft size={14} />,
  center: <AlignCenter size={14} />,
  right: <AlignRight size={14} />,
  justify: <AlignJustify size={14} />,
  '': <AlignLeft size={14} />,
};

export function TextAlignPlugin() {
  const [editor] = useLexicalComposerContext();
  const textAlign = useToolbarStore((state) => state.textAlign);
  console.log(textAlign);

  function handleCloseAutoFocus(e: Event) {
    e.preventDefault();
    editor.focus();
  }

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <ToolbarButton type='button' className='gap-1'>
            {textFormatIcons[textAlign]} <ChevronDown size={14} />
          </ToolbarButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='min-w-max' onCloseAutoFocus={handleCloseAutoFocus}>
          {Object.entries(textFormatIcons)
            .filter(([key]) => Boolean(key))
            .map(([key, icon]) => (
              <DropdownMenuItem
                key={key}
                className='hover:cursor-pointer'
                onClick={() => {
                  editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, key as ElementFormatType);
                }}
              >
                {icon}
              </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
