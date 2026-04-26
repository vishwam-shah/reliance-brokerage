import { Badge } from '@/components/ui/Badge';

type Variant = 'success' | 'warning' | 'error' | 'info' | 'purple' | 'default';

const variantMap: Record<string, Variant> = {
  active: 'success',
  pending_approval: 'warning',
  rejected: 'error',
  draft: 'default',
  closed: 'default',
  new: 'info',
  contacted: 'purple',
  closed_won: 'success',
};

const labels: Record<string, string> = {
  active: 'Active',
  pending_approval: 'Pending',
  rejected: 'Rejected',
  draft: 'Draft',
  closed: 'Closed',
  new: 'New',
  contacted: 'Contacted',
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant={variantMap[status] ?? 'default'}>
      {labels[status] ?? status}
    </Badge>
  );
}
