import { ListCollapse } from 'lucide-react';
import { ToolbarButton } from '../ui/toolbar';

export function ToggleList() {
  return (
    <ToolbarButton type='button'>
      <ListCollapse size={14} />
    </ToolbarButton>
  );
}
