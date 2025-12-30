import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import TopicCard from '@/components/TopicCard';
import MiniStatsCard from '@/components/MiniStatsCard';
import CircularProgress from '@/components/CircularProgress';
import DifficultyBreakdown from '@/components/DifficultyBreakdown';
import { Target, Zap, TrendingUp, Award, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Problem {
  _id: string;
  topic_id: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface Topic {
  _id: string;
  name: string;
  description: string | null;
  order_index: number;
}

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [completedProblems, setCompletedProblems] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

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
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

      const [topicsRes, problemsRes, progressRes] = await Promise.all([
        fetch('/api/topics'),
        fetch('/api/problems'),
        fetch('/api/progress', { headers })
      ]);

      if (!topicsRes.ok || !problemsRes.ok) throw new Error('Failed to fetch data');

      const topicsData = await topicsRes.json();
      const problemsData = await problemsRes.json();
      const progressData = progressRes.ok ? await progressRes.json() : [];

      setTopics(topicsData || []);
      setProblems(problemsData || []);
      setCompletedProblems(new Set(progressData.filter((p: any) => p.completed).map((p: any) => p.problem_id)));
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({ variant: 'destructive', title: 'Error loading data' });
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const total = problems.length;
    const completed = problems.filter(p => completedProblems.has(p._id)).length;
    const easy = problems.filter(p => p.difficulty === 'easy');
    const medium = problems.filter(p => p.difficulty === 'medium');
    const hard = problems.filter(p => p.difficulty === 'hard');

    const easyCompleted = easy.filter(p => completedProblems.has(p._id)).length;
    const mediumCompleted = medium.filter(p => completedProblems.has(p._id)).length;
    const hardCompleted = hard.filter(p => completedProblems.has(p._id)).length;

    return {
      total,
      completed,
      remaining: total - completed,
      progressPercent: total > 0 ? Math.round((completed / total) * 100) : 0,
      easy: { completed: easyCompleted, total: easy.length },
      medium: { completed: mediumCompleted, total: medium.length },
      hard: { completed: hardCompleted, total: hard.length },
    };
  }, [problems, completedProblems]);

  const topicsWithProgress = useMemo(() => {
    return topics.map(topic => {
      const topicProblems = problems.filter(p => {
        const tid = typeof p.topic_id === 'object' ? (p.topic_id as any)._id : p.topic_id;
        return tid === topic._id;
      });
      const completed = topicProblems.filter(p => completedProblems.has(p._id)).length;
      return {
        ...topic,
        completed,
        total: topicProblems.length,
      };
    });
  }, [topics, problems, completedProblems]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse">Loading your progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container px-4 md:px-8 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MiniStatsCard
            title="Total Progress"
            value={`${stats.completed}/${stats.total}`}
            subtitle="problems completed"
            icon={Target}
            iconColor="text-primary"
            iconBgColor="bg-primary/20"
          />
          <MiniStatsCard
            title="Easy"
            value={`${stats.easy.completed}/${stats.easy.total}`}
            subtitle="problems solved"
            icon={Zap}
            iconColor="text-easy"
            iconBgColor="bg-easy/20"
          />
          <MiniStatsCard
            title="Medium"
            value={`${stats.medium.completed}/${stats.medium.total}`}
            subtitle="problems solved"
            icon={TrendingUp}
            iconColor="text-medium"
            iconBgColor="bg-medium/20"
          />
          <MiniStatsCard
            title="Hard"
            value={`${stats.hard.completed}/${stats.hard.total}`}
            subtitle="problems solved"
            icon={Award}
            iconColor="text-hard"
            iconBgColor="bg-hard/20"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-10">
          <div className="glass-card rounded-xl p-6 animate-scale-in">
            <h3 className="font-semibold text-lg mb-6">Overall Progress</h3>
            <div className="flex flex-col items-center">
              <CircularProgress value={stats.progressPercent} size={200} strokeWidth={14}>
                <span className="text-4xl font-bold">{stats.progressPercent}%</span>
                <span className="text-sm text-muted-foreground">complete</span>
              </CircularProgress>
              <p className="text-muted-foreground mt-4 text-sm">
                {stats.remaining} problems remaining
              </p>
            </div>
          </div>

          <div className="glass-card rounded-xl p-6 animate-scale-in" style={{ animationDelay: '100ms' }}>
            <DifficultyBreakdown
              items={[
                { label: 'Easy', completed: stats.easy.completed, total: stats.easy.total, color: 'easy' },
                { label: 'Medium', completed: stats.medium.completed, total: stats.medium.total, color: 'medium' },
                { label: 'Hard', completed: stats.hard.completed, total: stats.hard.total, color: 'hard' },
              ]}
            />
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">Topics</h2>
          <p className="text-muted-foreground text-sm">Select a topic to start practicing</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topicsWithProgress.map((topic, index) => (
            <TopicCard
              key={topic._id}
              id={topic._id}
              name={topic.name}
              description={topic.description}
              completed={topic.completed}
              total={topic.total}
              index={index}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
