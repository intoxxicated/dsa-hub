import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { 
  ChevronRight, 
  Layers, 
  Type, 
  Link2, 
  Layers3, 
  TreePine, 
  Network, 
  Sparkles, 
  RotateCcw 
} from 'lucide-react';

interface TopicCardProps {
  id: string;
  name: string;
  description: string | null;
  completed: number;
  total: number;
  index: number;
}

const topicIcons: Record<string, typeof Layers> = {
  'Arrays': Layers,
  'Strings': Type,
  'Linked Lists': Link2,
  'Stacks & Queues': Layers3,
  'Trees': TreePine,
  'Graphs': Network,
  'Dynamic Programming': Sparkles,
  'Recursion & Backtracking': RotateCcw,
};

const topicColors: Record<string, { bg: string; icon: string; border: string }> = {
  'Arrays': { bg: 'bg-primary/10', icon: 'text-primary', border: 'border-primary/20' },
  'Strings': { bg: 'bg-violet-500/10', icon: 'text-violet-500', border: 'border-violet-500/20' },
  'Linked Lists': { bg: 'bg-cyan-500/10', icon: 'text-cyan-500', border: 'border-cyan-500/20' },
  'Stacks & Queues': { bg: 'bg-amber-500/10', icon: 'text-amber-500', border: 'border-amber-500/20' },
  'Trees': { bg: 'bg-easy/10', icon: 'text-easy', border: 'border-easy/20' },
  'Graphs': { bg: 'bg-pink-500/10', icon: 'text-pink-500', border: 'border-pink-500/20' },
  'Dynamic Programming': { bg: 'bg-purple-500/10', icon: 'text-purple-500', border: 'border-purple-500/20' },
  'Recursion & Backtracking': { bg: 'bg-orange-500/10', icon: 'text-orange-500', border: 'border-orange-500/20' },
};

const TopicCard = ({ id, name, description, completed, total, index }: TopicCardProps) => {
  const navigate = useNavigate();
  const Icon = topicIcons[name] || Layers;
  const colors = topicColors[name] || { bg: 'bg-primary/10', icon: 'text-primary', border: 'border-primary/20' };
  const progressPercent = total > 0 ? (completed / total) * 100 : 0;
  const isCompleted = completed === total && total > 0;

  return (
    <button
      onClick={() => navigate(`/chapter/${id}`)}
      className={cn(
        'glass-card rounded-xl p-5 text-left w-full transition-all duration-300',
        'hover:scale-[1.02] hover:shadow-lg group',
        'animate-slide-up opacity-0',
        isCompleted && 'border-easy/30 bg-easy/5'
      )}
      style={{ animationDelay: `${index * 75}ms`, animationFillMode: 'forwards' }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn(
          'w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110',
          colors.bg
        )}>
          <Icon className={cn('w-5 h-5', colors.icon)} />
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1" />
      </div>
      
      <h3 className="font-semibold text-base mb-1">{name}</h3>
      {description && (
        <p className="text-xs text-muted-foreground line-clamp-2 mb-4 min-h-[2rem]">
          {description}
        </p>
      )}
      
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Progress</span>
          <span className={cn(
            'font-mono font-medium',
            isCompleted ? 'text-easy' : 'text-foreground'
          )}>
            {completed}/{total}
          </span>
        </div>
        <Progress 
          value={progressPercent} 
          className={cn('h-1.5', isCompleted && 'bg-easy/20')}
        />
      </div>
    </button>
  );
};

export default TopicCard;
