import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Baseline } from 'lucide-react';
import { useToolbarStore } from '../store/toolbar-context';
import { ToolbarButton } from '../ui/toolbar';
import { ColorPicker } from './test/color-picker';

export function FontColorPlugin() {
  const fontColor = useToolbarStore((state) => state.fontColor);

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <ToolbarButton type='button'>
            <Baseline size={14} />
          </ToolbarButton>
        </PopoverTrigger>
        <PopoverContent className='p-3 w-max'>
          <ColorPicker color='#121212' onChange={(value) => console.log(value, fontColor)} />
        </PopoverContent>
      </Popover>
    </div>
  );
}
