import { Button } from '@/components/ui/button';
import { Link, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  return (
    <div className='p-2'>
      <h3>Lexical editor using react</h3>
      <Button asChild>
        <Link to='/editor'>Editor</Link>
      </Button>
    </div>
  );
}
