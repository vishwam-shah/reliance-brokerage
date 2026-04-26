import { CIcon } from '@coreui/icons-react';
import { cn } from '@/lib/utils';

export type StatCardColor = 'gold' | 'green' | 'blue' | 'red' | 'purple' | 'neutral';

const palette: Record<StatCardColor, { iconBg: string; iconColor: string; value: string }> = {
  gold:    { iconBg: 'bg-amber-50',   iconColor: 'text-amber-600',   value: 'text-amber-700' },
  green:   { iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600', value: 'text-emerald-700' },
  blue:    { iconBg: 'bg-blue-50',    iconColor: 'text-blue-600',    value: 'text-blue-700' },
  red:     { iconBg: 'bg-red-50',     iconColor: 'text-red-600',     value: 'text-red-700' },
  purple:  { iconBg: 'bg-purple-50',  iconColor: 'text-purple-600',  value: 'text-purple-700' },
  neutral: { iconBg: 'bg-slate-100',  iconColor: 'text-slate-600',   value: 'text-slate-800' },
};

interface StatCardProps {
  icon: string | string[];
  label: string;
  value: number | string;
  secondary?: string;
  color?: StatCardColor;
  className?: string;
}

export function StatCard({
  icon,
  label,
  value,
  secondary,
  color = 'neutral',
  className,
}: StatCardProps) {
  const { iconBg, iconColor, value: valueColor } = palette[color];

  return (
    <div
      className={cn(
        'bg-white rounded-2xl border border-slate-200 p-6',
        'flex flex-col gap-4',
        'hover:shadow-lg hover:border-slate-300 transition-all duration-200',
        className
      )}
    >
      {/* Top row: icon + label */}
      <div className="flex items-center justify-between gap-3">
        <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center shrink-0', iconBg)}>
          <CIcon icon={icon} className={iconColor} style={{ width: 22, height: 22 }} />
        </div>
        <span className="text-xs font-semibold text-slate-500 text-right leading-tight">{label}</span>
      </div>

      {/* Value */}
      <div>
        <p className={cn('font-headline font-bold leading-none tabular-nums', valueColor, 'text-4xl')}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
        {secondary && (
          <p className="text-xs text-slate-400 mt-2 leading-snug">{secondary}</p>
        )}
      </div>
    </div>
  );
}
