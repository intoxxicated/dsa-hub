import { useState } from 'react';
import { ChevronDown, ChevronRight, Folder, FolderOpen } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import ProblemRow from './ProblemRow';
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

interface Chapter {
  id: string;
  name: string;
  description: string | null;
  problems: Problem[];
}

interface ChapterCardProps {
  chapter: Chapter;
  completedProblems: Set<string>;
  onToggleProblem: (problemId: string, completed: boolean) => void;
  defaultExpanded?: boolean;
}

const ChapterCard = ({ chapter, completedProblems, onToggleProblem, defaultExpanded = false }: ChapterCardProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  
  const totalProblems = chapter.problems.length;
  const completedCount = chapter.problems.filter(p => completedProblems.has(p.id)).length;
  const progressPercent = totalProblems > 0 ? (completedCount / totalProblems) * 100 : 0;

  return (
    <div className="glass-card rounded-xl overflow-hidden animate-slide-up">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-5 flex items-center gap-4 hover:bg-muted/30 transition-colors duration-200"
      >
        {/* Folder Icon */}
        <div className={cn(
          'w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-300',
          isExpanded ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
        )}>
          {isExpanded ? (
            <FolderOpen className="w-5 h-5" />
          ) : (
            <Folder className="w-5 h-5" />
          )}
        </div>

        {/* Title & Description */}
        <div className="flex-1 text-left">
          <h3 className="font-semibold text-lg">{chapter.name}</h3>
          {chapter.description && (
            <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">
              {chapter.description}
            </p>
          )}
        </div>

        {/* Progress */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-sm font-mono">
              <span className={cn(
                completedCount === totalProblems && totalProblems > 0 ? 'text-easy' : 'text-foreground'
              )}>
                {completedCount}
              </span>
              <span className="text-muted-foreground">/{totalProblems}</span>
            </span>
          </div>
          <div className="w-24 hidden sm:block">
            <Progress 
              value={progressPercent} 
              className={cn(
                'h-2',
                completedCount === totalProblems && totalProblems > 0 && 'bg-easy/20'
              )}
            />
          </div>
          <div className="text-muted-foreground">
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 transition-transform duration-200" />
            ) : (
              <ChevronRight className="w-5 h-5 transition-transform duration-200" />
            )}
          </div>
        </div>
      </button>

      {/* Problems List */}
      {isExpanded && (
        <div className="px-5 pb-5 space-y-2 border-t border-border/50">
          <div className="pt-4">
            {chapter.problems.length > 0 ? (
              chapter.problems.map((problem, index) => (
                <div key={problem.id} className="mt-2 first:mt-0">
                  <ProblemRow
                    problem={problem}
                    isCompleted={completedProblems.has(problem.id)}
                    onToggleComplete={onToggleProblem}
                    index={index}
                  />
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No problems in this chapter yet.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChapterCard;
