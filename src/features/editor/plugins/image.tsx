import { ChevronDown, Image } from 'lucide-react';
import { ToolbarButton } from '../ui/toolbar';

export function ImagePlugin() {
  return (
    <ToolbarButton type='button' className='gap-1'>
      <Image size={14} /> <ChevronDown size={14} />
    </ToolbarButton>
  );
}
