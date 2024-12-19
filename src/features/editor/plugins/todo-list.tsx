import { ListTodo } from 'lucide-react';
import { ToolbarButton } from '../ui/toolbar';

export function TodoList() {
  return (
    <ToolbarButton type='button'>
      <ListTodo size={14} />
    </ToolbarButton>
  );
}
