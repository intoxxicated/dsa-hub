import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'default' | 'primary' | 'success' | 'warning';
  className?: string;
}

const StatsCard = ({ title, value, subtitle, icon: Icon, variant = 'default', className }: StatsCardProps) => {
  const variants = {
    default: 'bg-card border-border/50',
    primary: 'bg-primary/10 border-primary/20',
    success: 'bg-easy/10 border-easy/20',
    warning: 'bg-medium/10 border-medium/20',
  };

  const iconVariants = {
    default: 'bg-muted text-muted-foreground',
    primary: 'bg-primary/20 text-primary',
    success: 'bg-easy/20 text-easy',
    warning: 'bg-medium/20 text-medium',
  };

  return (
    <div className={cn(
      'p-5 rounded-xl border glass-card transition-all duration-300 hover:scale-[1.02]',
      variants[variant],
      className
    )}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-3xl font-bold mt-1 font-mono">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        <div className={cn(
          'w-10 h-10 rounded-lg flex items-center justify-center',
          iconVariants[variant]
        )}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
