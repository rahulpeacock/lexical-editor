import { PaintBucket } from 'lucide-react';
import { useToolbarStore } from '../store/toolbar-context';
import { ToolbarButton } from '../ui/toolbar';

export function BgColorPlugin() {
  const bgColor = useToolbarStore((state) => state.bgColor);

  return (
    <ToolbarButton type='button' onClick={() => console.log('bgColor: ', bgColor)}>
      <PaintBucket size={14} />
    </ToolbarButton>
  );
}
