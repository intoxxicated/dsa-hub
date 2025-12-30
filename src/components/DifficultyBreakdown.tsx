import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface DifficultyItem {
  label: string;
  completed: number;
  total: number;
  color: 'easy' | 'medium' | 'hard';
}

interface DifficultyBreakdownProps {
  items: DifficultyItem[];
  className?: string;
}

const DifficultyBreakdown = ({ items, className }: DifficultyBreakdownProps) => {
  const colorClasses = {
    easy: {
      text: 'text-easy',
      bg: 'bg-easy',
      track: 'bg-easy/20',
    },
    medium: {
      text: 'text-medium',
      bg: 'bg-medium',
      track: 'bg-medium/20',
    },
    hard: {
      text: 'text-hard',
      bg: 'bg-hard',
      track: 'bg-hard/20',
    },
  };

  return (
    <div className={cn('space-y-4', className)}>
      <h3 className="font-semibold text-lg">Difficulty Breakdown</h3>
      <div className="space-y-4">
        {items.map((item) => {
          const percent = item.total > 0 ? (item.completed / item.total) * 100 : 0;
          const colors = colorClasses[item.color];
          
          return (
            <div key={item.label} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={cn('text-sm font-medium', colors.text)}>
                  {item.label}
                </span>
                <span className="text-sm text-muted-foreground font-mono">
                  {item.completed}/{item.total}
                </span>
              </div>
              <div className={cn('h-2.5 rounded-full overflow-hidden', colors.track)}>
                <div 
                  className={cn('h-full rounded-full transition-all duration-500 ease-out', colors.bg)}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DifficultyBreakdown;
