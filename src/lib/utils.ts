import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatRmAmount(amount: number): string {
  if (!Number.isFinite(amount) || amount <= 0) return '';
  return `RM ${amount.toLocaleString('en-MY', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

export function parseLegacyRmAmount(value: string): number | null {
  if (!value) return null;

  const cleaned = value.trim().toUpperCase().replace(/,/g, '').replace(/^RM\s*/, '');
  const match = cleaned.match(/^([0-9]*\.?[0-9]+)\s*([KMB])?$/);
  if (!match) return null;

  const base = Number.parseFloat(match[1]);
  if (!Number.isFinite(base) || base <= 0) return null;

  const suffix = match[2];
  const multiplier = suffix === 'B' ? 1_000_000_000 : suffix === 'M' ? 1_000_000 : suffix === 'K' ? 1_000 : 1;

  return base * multiplier;
}

export function formatListingRmAmount(amountNum: number, fallbackText?: string): string {
  const numeric = formatRmAmount(amountNum);
  if (numeric) return numeric;

  const parsedFallback = fallbackText ? parseLegacyRmAmount(fallbackText) : null;
  if (parsedFallback) return formatRmAmount(parsedFallback);

  return fallbackText ?? '';
}
