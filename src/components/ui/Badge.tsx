import { cn } from '@/lib/utils';

type Variant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'purple' | 'outline';

const variantClasses: Record<Variant, string> = {
  default: 'bg-surface-container text-on-surface-variant',
  success: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  warning: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  error: 'bg-red-50 text-red-700 ring-1 ring-red-200',
  info: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  purple: 'bg-purple-50 text-purple-700 ring-1 ring-purple-200',
  outline: 'bg-transparent text-on-surface-variant ring-1 ring-outline-variant',
};

export function Badge({
  variant = 'default',
  children,
  className,
}: {
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
