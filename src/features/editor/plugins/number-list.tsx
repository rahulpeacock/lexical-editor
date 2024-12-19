import { ListOrdered } from 'lucide-react';
import { ToolbarButton } from '../ui/toolbar';

export function NumberList() {
  return (
    <ToolbarButton type='button'>
      <ListOrdered size={14} />
    </ToolbarButton>
  );
}
