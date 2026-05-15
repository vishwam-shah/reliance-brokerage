'use client';

import { Skeleton } from '@/components/ui/Skeleton';

interface LoadingStateProps {
  count?: number;
  height?: string;
}

export function TableLoading({ count = 5, height = 'h-12' }: LoadingStateProps) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className={`w-full ${height}`} />
      ))}
    </div>
  );
}

export function StatsLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-32 rounded-lg" />
      ))}
    </div>
  );
}
