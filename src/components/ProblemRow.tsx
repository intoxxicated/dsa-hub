import { useState } from 'react';
import { Button } from '@/components/ui/button';
import DifficultyBadge from './DifficultyBadge';
import { Youtube, ExternalLink, FileText, Check, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Problem {
    id: string;
    name: string;
    difficulty: 'easy' | 'medium' | 'hard';
    youtube_link: string | null;
    leetcode_link: string | null;
    codeforces_link: string | null;
    article_link: string | null;
}

interface ProblemRowProps {
    problem: Problem;
    isCompleted: boolean;
    onToggleComplete: (problemId: string, completed: boolean) => void;
    index: number;
}

const ProblemRow = ({ problem, isCompleted, onToggleComplete, index }: ProblemRowProps) => {
    const [isAnimating, setIsAnimating] = useState(false);

    const handleToggle = () => {
        setIsAnimating(true);
        onToggleComplete(problem.id, !isCompleted);
        setTimeout(() => setIsAnimating(false), 300);
    };

    // Check if there are any links
    const hasLinks = problem.youtube_link || problem.leetcode_link || problem.article_link;

    return (
        <div
            className={cn(
                'group flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-4 rounded-xl border transition-all duration-300',
                'hover:shadow-md',
                isCompleted
                    ? 'bg-easy/5 border-easy/30 hover:border-easy/50'
                    : 'bg-card/50 border-border/50 hover:border-primary/30 hover:bg-muted/30'
            )}
        >
            {/* First row for mobile: Checkbox, Problem Number, and Difficulty */}
            <div className="flex items-center w-full sm:w-auto gap-3">
                {/* Checkbox */}
                <button
                    onClick={handleToggle}
                    className={cn(
                        'flex-shrink-0 w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all duration-300',
                        isCompleted
                            ? 'bg-easy border-easy text-easy-foreground scale-100'
                            : 'border-muted-foreground/40 hover:border-primary hover:scale-105'
                    )}
                >
                    {isCompleted && (
                        <Check
                            className={cn(
                                'w-4 h-4',
                                isAnimating && 'animate-check-bounce'
                            )}
                        />
                    )}
                </button>

                {/* Problem Number - Hidden on very small screens, shown on sm+ */}
                <span className={cn(
                    'flex-shrink-0 text-sm font-mono font-medium hidden xs:block',
                    isCompleted ? 'text-easy' : 'text-muted-foreground'
                )}>
          #{String(index + 1).padStart(2, '0')}
        </span>

                {/* Problem Name - Full width on mobile, truncated on larger screens */}
                <div className="flex-1 min-w-0 flex items-center gap-2 sm:hidden">
          <span
              className={cn(
                  'font-medium text-sm sm:text-base transition-all duration-300 truncate',
                  isCompleted && 'line-through text-muted-foreground'
              )}
          >
            {problem.name}
          </span>
                    {isCompleted && (
                        <CheckCircle2 className="w-4 h-4 text-easy flex-shrink-0" />
                    )}
                </div>

                {/* Difficulty Badge on mobile - Right aligned */}
                <div className="ml-auto sm:ml-0">
                    <DifficultyBadge difficulty={problem.difficulty} />
                </div>
            </div>

            {/* Problem Name - Hidden on mobile, shown on sm+ */}
            <div className="hidden sm:flex flex-1 min-w-0 items-center gap-2">
                {/* Problem Number - Hidden on mobile, shown on sm+ */}
                <span className={cn(
                    'flex-shrink-0 w-10 text-sm font-mono font-medium mr-2',
                    isCompleted ? 'text-easy' : 'text-muted-foreground'
                )}>
          #{String(index + 1).padStart(2, '0')}
        </span>

                <span
                    className={cn(
                        'font-medium transition-all duration-300 truncate',
                        isCompleted && 'line-through text-muted-foreground'
                    )}
                >
          {problem.name}
        </span>
                {isCompleted && (
                    <CheckCircle2 className="w-4 h-4 text-easy flex-shrink-0" />
                )}
            </div>

            {/* Links and Difficulty (desktop) */}
            <div className="flex items-center justify-between w-full sm:w-auto sm:justify-end gap-2 mt-2 sm:mt-0">
                {/* Difficulty Badge - Hidden on mobile, shown on sm+ */}
                <div className="hidden sm:block mr-2">
                    <DifficultyBadge difficulty={problem.difficulty} />
                </div>

                {/* Links - Always visible */}
                {hasLinks && (
                    <div className="flex items-center gap-1 transition-opacity duration-300">
                        {problem.youtube_link && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 sm:h-9 sm:w-9 text-destructive/70 hover:text-destructive hover:bg-destructive/10 rounded-lg"
                                asChild
                            >
                                <a href={problem.youtube_link} target="_blank" rel="noopener noreferrer" title="Watch Tutorial">
                                    <Youtube className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                </a>
                            </Button>
                        )}
                        {problem.leetcode_link && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 sm:h-9 sm:w-9 text-medium/70 hover:text-medium hover:bg-medium/10 rounded-lg"
                                asChild
                            >
                                <a href={problem.leetcode_link} target="_blank" rel="noopener noreferrer" title="Practice on LeetCode">
                                    <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                </a>
                            </Button>
                        )}
                        {problem.article_link && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 sm:h-9 sm:w-9 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg"
                                asChild
                            >
                                <a href={problem.article_link} target="_blank" rel="noopener noreferrer" title="Read Article">
                                    <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                </a>
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProblemRow;