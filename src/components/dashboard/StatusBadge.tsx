const styles: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  pending_approval: 'bg-yellow-100 text-yellow-800',
  rejected: 'bg-red-100 text-red-800',
  draft: 'bg-gray-100 text-gray-800',
  closed: 'bg-gray-200 text-gray-700',
  new: 'bg-blue-100 text-blue-800',
  contacted: 'bg-purple-100 text-purple-800',
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
    <span className={`inline-block px-2 py-0.5 text-label-xs font-semibold uppercase tracking-wider ${styles[status] ?? 'bg-gray-100 text-gray-700'}`}>
      {labels[status] ?? status}
    </span>
  );
}
