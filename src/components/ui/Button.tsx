import Link from 'next/link';
import { CIcon } from '@coreui/icons-react';
import { cn } from '@/lib/utils';
import type { ButtonProps } from '@/types';

const variantMap: Record<string, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  danger: 'btn btn-primary bg-error hover:bg-error/90',
  outline: 'border border-outline-variant bg-transparent text-on-surface hover:bg-surface-container',
};

const sizeMap: Record<string, string> = { sm: 'btn-sm', md: '', lg: 'btn-lg' };

const Button = ({
  variant = 'primary',
  size = 'md',
  children,
  href,
  onClick,
  className = '',
  type = 'button',
  disabled = false,
  loading,
  icon,
  iconRight,
}: ButtonProps & {
  loading?: boolean;
  icon?: string | string[];
  iconRight?: string | string[];
}) => {
  const classes = cn(
    'btn',
    variantMap[variant] ?? 'btn-primary',
    sizeMap[size] ?? '',
    className
  );

  const inner = (
    <>
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon ? (
        <CIcon icon={icon} style={{ width: 16, height: 16 }} />
      ) : null}
      {children}
      {iconRight && !loading && <CIcon icon={iconRight} style={{ width: 16, height: 16 }} />}
    </>
  );

  if (href) {
    return <Link href={href} className={classes} onClick={onClick}>{inner}</Link>;
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled || loading} className={classes}>
      {inner}
    </button>
  );
};

export default Button;
