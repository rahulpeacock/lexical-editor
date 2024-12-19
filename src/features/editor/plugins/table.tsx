import { ChevronDown, Table } from 'lucide-react';
import { ToolbarButton } from '../ui/toolbar';

export function TablePlugin() {
  return (
    <ToolbarButton type='button' className='gap-1'>
      <Table size={14} /> <ChevronDown size={14} />
    </ToolbarButton>
  );
}
