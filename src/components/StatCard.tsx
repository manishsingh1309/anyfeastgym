import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: number; positive: boolean };
  variant?: 'default' | 'crimson' | 'orange' | 'yellow';
}

const variantStyles = {
  default: 'bg-card text-card-foreground',
  crimson: 'bg-[#B32024] text-white',
  orange: 'bg-[#EF3E2D] text-white',
  yellow: 'bg-[#2F8F4E] text-white hover:bg-[#267A3D]',
};

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon: Icon, trend, variant = 'default' }) => {
  const isColored = variant !== 'default';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'rounded-xl p-5 shadow-card transition-all hover:shadow-elevated',
        variantStyles[variant]
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className={cn('text-sm font-medium', isColored ? 'opacity-80' : 'text-muted-foreground')}>
            {title}
          </p>
          <p className="mt-2 text-3xl font-display font-bold">{value}</p>
          {subtitle && (
            <p className={cn('mt-1 text-xs', isColored ? 'opacity-70' : 'text-muted-foreground')}>
              {subtitle}
            </p>
          )}
          {trend && (
            <p className={cn('mt-1 text-xs font-semibold', trend.positive ? 'text-green-500' : 'text-destructive')}>
              {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        <div className={cn(
          'rounded-lg p-2.5',
          isColored ? 'bg-primary-foreground/20' : 'bg-muted'
        )}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
