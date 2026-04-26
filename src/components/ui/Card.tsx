import { cn } from '@/lib/utils';

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn('bg-white rounded-2xl border border-slate-200', className)}>
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
  action,
}: {
  className?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className={cn('flex items-center justify-between px-6 py-4 border-b border-slate-100', className)}>
      <div>{children}</div>
      {action && <div className="ml-4 flex items-center gap-2">{action}</div>}
    </div>
  );
}

export function CardTitle({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <h3 className={cn('font-headline font-semibold text-slate-900 text-[15px]', className)}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <p className={cn('text-xs text-slate-500 mt-0.5', className)}>{children}</p>
  );
}

export function CardContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn('px-6 py-5', className)}>{children}</div>;
}

export function CardFooter({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn('px-6 py-4 border-t border-slate-100 flex items-center gap-3', className)}>
      {children}
    </div>
  );
}
