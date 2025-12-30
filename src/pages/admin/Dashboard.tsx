import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminApi } from '@/hooks/useAdminApi';
import { FolderTree, ListChecks, TrendingUp, Users, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Progress as ProgressBar } from '@/components/ui/progress';

interface UserProgress {
    _id: string;
    email: string;
    full_name: string;
    created_at: string;
    completedProblems: number;
}

const AdminDashboard = () => {
    const { getAllChapters, getAllProblems, getUsersProgress } = useAdminApi();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalTopics: 0,
        totalProblems: 0,
        easyProblems: 0,
        mediumProblems: 0,
        hardProblems: 0,
        totalUsers: 0,
    });
    const [usersProgress, setUsersProgress] = useState<UserProgress[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const [chaptersRes, problemsRes, usersRes] = await Promise.all([
                getAllChapters(),
                getAllProblems(),
                getUsersProgress(),
            ]);

            const topics = chaptersRes.data || [];
            const problems = problemsRes.data || [];
            const usersData = usersRes.data?.users || [];

            setStats({
                totalTopics: topics.length,
                totalProblems: problems.length,
                easyProblems: problems.filter((p: any) => p.difficulty === 'easy').length,
                mediumProblems: problems.filter((p: any) => p.difficulty === 'medium').length,
                hardProblems: problems.filter((p: any) => p.difficulty === 'hard').length,
                totalUsers: usersData.length,
            });

            setUsersProgress(usersData);
            setLoading(false);
        };

        fetchData();
    }, []);

    const statCards = [
        {
            title: 'Total Users',
            value: stats.totalUsers,
            icon: Users,
            color: 'text-blue-500',
        },
        {
            title: 'Total Topics',
            value: stats.totalTopics,
            icon: FolderTree,
            color: 'text-primary',
            link: '/admin/topics',
        },
        {
            title: 'Total Problems',
            value: stats.totalProblems,
            icon: ListChecks,
            color: 'text-primary',
            link: '/admin/problems',
        },
        {
            title: 'Easy Problems',
            value: stats.easyProblems,
            icon: TrendingUp,
            color: 'text-green-500',
        },
        {
            title: 'Medium Problems',
            value: stats.mediumProblems,
            icon: TrendingUp,
            color: 'text-orange-500',
        },
        {
            title: 'Hard Problems',
            value: stats.hardProblems,
            icon: TrendingUp,
            color: 'text-red-500',
        },
    ];

    return (
        <AdminLayout>
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                        <p className="text-muted-foreground mt-2">
                            Manage your DSA platform content and track statistics
                        </p>
                    </div>
                    {loading && <Loader2 className="h-6 w-6 animate-spin text-primary" />}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {statCards.map((stat) => {
                        const Icon = stat.icon;
                        const CardWrapper = stat.link ? Link : 'div';

                        return (
                            <CardWrapper
                                key={stat.title}
                                to={stat.link || '#'}
                                className={stat.link ? 'block transition-transform hover:scale-105' : ''}
                            >
                                <Card className="glass-card">
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">
                                            {stat.title}
                                        </CardTitle>
                                        <Icon className={`h-4 w-4 ${stat.color}`} />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{stat.value}</div>
                                    </CardContent>
                                </Card>
                            </CardWrapper>
                        );
                    })}
                </div>

                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle>User Progress</CardTitle>
                        <CardDescription>Overall problem solving status of registered users</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>User</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Joined</TableHead>
                                        <TableHead className="w-[200px]">Progress</TableHead>
                                        <TableHead className="text-right">Solved</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-24 text-center">
                                                <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                                            </TableCell>
                                        </TableRow>
                                    ) : usersProgress.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-24 text-center">
                                                No users found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        usersProgress.map((user) => (
                                            <TableRow key={user._id}>
                                                <TableCell className="font-medium">
                                                    {user.full_name || 'Anonymous'}
                                                </TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell>
                                                    {new Date(user.created_at).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-1">
                                                        <ProgressBar
                                                            value={(user.completedProblems / stats.totalProblems) * 100}
                                                            className="h-2"
                                                        />
                                                        <span className="text-[10px] text-muted-foreground">
                                                            {Math.round((user.completedProblems / stats.totalProblems) * 100)}% Complete
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right font-mono">
                                                    {user.completedProblems} / {stats.totalProblems}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Common administrative tasks</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-4">
                        <Link to="/admin/topics">
                            <Button className="glow-primary">
                                <FolderTree className="mr-2 h-4 w-4" />
                                Manage Topics
                            </Button>
                        </Link>
                        <Link to="/admin/problems">
                            <Button className="glow-primary">
                                <ListChecks className="mr-2 h-4 w-4" />
                                Manage Problems
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
