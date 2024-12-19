import { Link } from 'lucide-react';
import { ToolbarButton } from '../ui/toolbar';

export function LinkPlugin() {
  return (
    <ToolbarButton type='button'>
      <Link size={14} />
    </ToolbarButton>
  );
}
