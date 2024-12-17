import { BaseEditor } from '@/features/editor/base-editor';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/editor')({
  component: RouteComponent,
});

function RouteComponent() {
  return <BaseEditor />;
}
