import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface MiniStatsCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  className?: string;
}

const MiniStatsCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  iconColor = 'text-primary',
  iconBgColor = 'bg-primary/20',
  className 
}: MiniStatsCardProps) => {
  return (
    <div className={cn(
      'glass-card rounded-xl p-5 flex items-center gap-4 transition-all duration-300 hover:scale-[1.02] hover:border-primary/30',
      className
    )}>
      <div className="flex-1">
        <p className="text-xs text-muted-foreground uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-bold mt-1 font-mono">{value}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
      </div>
      <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', iconBgColor)}>
        <Icon className={cn('w-6 h-6', iconColor)} />
      </div>
    </div>
  );
};

export default MiniStatsCard;
