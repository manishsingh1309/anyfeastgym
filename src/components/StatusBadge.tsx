import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusStyles: Record<string, string> = {
  active: 'bg-green-100 text-green-700 border-green-200',
  inactive: 'bg-muted text-muted-foreground border-border',
  expired: 'bg-red-100 text-red-700 border-red-200',
  cancelled: 'bg-orange-100 text-orange-700 border-orange-200',
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  return (
    <span className={cn(
      'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize',
      statusStyles[status] || statusStyles.pending,
      className
    )}>
      <span className={cn(
        'mr-1.5 h-1.5 w-1.5 rounded-full',
        status === 'active' ? 'bg-green-500' :
        status === 'expired' ? 'bg-red-500' :
        status === 'cancelled' ? 'bg-orange-500' :
        status === 'inactive' ? 'bg-muted-foreground' :
        'bg-amber-500'
      )} />
      {status}
    </span>
  );
};

export default StatusBadge;
