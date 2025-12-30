import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import ProblemRow from '@/components/ProblemRow';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, CheckCircle2, Search, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Problem {
  _id: string;
  name: string;
  difficulty: 'easy' | 'medium' | 'hard';
  youtube_link: string | null;
  leetcode_link: string | null;
  codeforces_link: string | null;
  article_link: string | null;
  order_index: number;
}

interface Topic {
  _id: string;
  name: string;
  description: string | null;
}

const ChapterDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [topic, setTopic] = useState<Topic | null>(null);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [completedProblems, setCompletedProblems] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/auth');
      } else if (user.role === 'admin') {
        navigate('/admin');
      }
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user && id) {
      fetchData();
    }
  }, [user, id]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      const [topicRes, problemsRes, progressRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL || ''}/api/topics/${id}`),
        fetch(`${import.meta.env.VITE_API_URL || ''}/api/problems/topic/${id}`),
        fetch(`${import.meta.env.VITE_API_URL || ''}/api/progress`, { headers })
      ]);

      if (!topicRes.ok) {
        navigate('/');
        return;
      }

      const topicData = await topicRes.json();
      const problemsData = await problemsRes.json();
      const progressData = await progressRes.json();

      setTopic(topicData);
      setProblems(problemsData || []);
      setCompletedProblems(new Set(progressData.filter((p: any) => p.completed).map((p: any) => p.problem_id)));
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({ variant: 'destructive', title: 'Error loading topic' });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleProblem = async (problemId: string, completed: boolean) => {
    if (!user) return;

    setCompletedProblems(prev => {
      const next = new Set(prev);
      completed ? next.add(problemId) : next.delete(problemId);
      return next;
    });

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/progress/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ problem_id: problemId, completed }),
      });

      if (!response.ok) throw new Error('Failed to save progress');
    } catch (error) {
      setCompletedProblems(prev => {
        const next = new Set(prev);
        completed ? next.delete(problemId) : next.add(problemId);
        return next;
      });
      toast({ variant: 'destructive', title: 'Failed to save progress' });
    }
  };

  const filteredProblems = useMemo(() => {
    return problems.filter(problem => {
      if (searchQuery && !problem.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (difficultyFilter !== 'all' && problem.difficulty !== difficultyFilter) {
        return false;
      }
      if (statusFilter === 'completed' && !completedProblems.has(problem._id)) {
        return false;
      }
      if (statusFilter === 'pending' && completedProblems.has(problem._id)) {
        return false;
      }
      return true;
    });
  }, [problems, searchQuery, difficultyFilter, statusFilter, completedProblems]);

  const completedCount = problems.filter(p => completedProblems.has(p._id)).length;
  const progressPercent = problems.length > 0 ? (completedCount / problems.length) * 100 : 0;

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!topic) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container px-4 md:px-8 py-8 max-w-4xl mx-auto">
        <Button
          variant="ghost"
          className="mb-6 -ml-2 text-muted-foreground hover:text-foreground"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Topics
        </Button>

        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-2">{topic.name}</h1>
          {topic.description && (
            <p className="text-muted-foreground">{topic.description}</p>
          )}
        </div>

        <div className="glass-card rounded-xl p-5 mb-6 animate-slide-up">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            <span className="font-medium">Your Progress</span>
            <span className="ml-auto text-sm text-muted-foreground font-mono">
              {completedCount} / {problems.length} completed
            </span>
          </div>
          <Progress value={progressPercent} className="h-2.5" />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search problems..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="All Levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          {filteredProblems.length > 0 ? (
            filteredProblems.map((problem, index) => (
              <div
                key={problem._id}
                className="animate-slide-up opacity-0"
                style={{ animationDelay: `${150 + index * 50}ms`, animationFillMode: 'forwards' }}
              >
                <ProblemRow
                  problem={{
                    id: problem._id,
                    name: problem.name,
                    difficulty: problem.difficulty,
                    youtube_link: problem.youtube_link,
                    leetcode_link: problem.leetcode_link,
                    codeforces_link: problem.codeforces_link,
                    article_link: problem.article_link,
                  }}
                  isCompleted={completedProblems.has(problem._id)}
                  onToggleComplete={handleToggleProblem}
                  index={problem.order_index - 1}
                />
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              {searchQuery || difficultyFilter !== 'all' || statusFilter !== 'all'
                ? 'No problems match your filters'
                : 'No problems in this topic yet'}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ChapterDetail;
