import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import React from 'react';

interface ToolbarGroupProps extends React.ComponentPropsWithoutRef<'div'> {}

export function ToolbarGroup({ className, ...props }: ToolbarGroupProps) {
  return <div className={cn('flex items-center justify-start gap-0.5 border-r p-2', className)} {...props} />;
}

export interface ToolbarButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  asChild?: boolean;
}

export const ToolbarButton = React.forwardRef<HTMLButtonElement, ToolbarButtonProps>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      className={cn(
        'duration-200 text-[13px] font-semibold h-[25px] flex items-center justify-start px-1.5 rounded-[3px] text-foreground/70 hover:text-foreground hover:bg-zinc-200/80 data-[state=active]:bg-neutral-100 disabled:opacity-50 disabled:pointer-events-none',
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
ToolbarButton.displayName = 'ToolbarButton';
