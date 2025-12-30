import { cn } from '@/lib/utils';

interface DifficultyBadgeProps {
  difficulty: 'easy' | 'medium' | 'hard';
  className?: string;
}

const DifficultyBadge = ({ difficulty, className }: DifficultyBadgeProps) => {
  const styles = {
    easy: 'bg-easy/20 text-easy border-easy/30',
    medium: 'bg-medium/20 text-medium border-medium/30',
    hard: 'bg-hard/20 text-hard border-hard/30',
  };

  const labels = {
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        styles[difficulty],
        className
      )}
    >
      {labels[difficulty]}
    </span>
  );
};

export default DifficultyBadge;
