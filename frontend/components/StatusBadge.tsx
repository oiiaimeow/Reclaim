interface StatusBadgeProps {
  status: 'Active' | 'Cancelled' | 'Paused' | 'Pending';
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const statusColors = {
    Active: 'bg-green-500/20 text-green-400',
    Cancelled: 'bg-red-500/20 text-red-400',
    Paused: 'bg-yellow-500/20 text-yellow-400',
    Pending: 'bg-blue-500/20 text-blue-400',
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[status]}`}
    >
      {status}
    </span>
  );
}


