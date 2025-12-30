import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminApi, Problem, Topic } from '@/hooks/useAdminApi';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Plus, Pencil, Trash2, Loader2, ExternalLink } from 'lucide-react';
import DifficultyBadge from '@/components/DifficultyBadge';

const ProblemsManagement = () => {
    const { getAllProblems, getAllChapters, createProblem, updateProblem, deleteProblem } = useAdminApi();
    const [problems, setProblems] = useState<Problem[]>([]);
    const [topics, setTopics] = useState<Topic[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProblem, setEditingProblem] = useState<Problem | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        topic_id: '',
        difficulty: 'easy' as 'easy' | 'medium' | 'hard',
        leetcode_link: '',
        youtube_link: '',
        article_link: '',
        order_index: 0,
    });

    const fetchData = async () => {
        setLoading(true);
        const [problemsRes, topicsRes] = await Promise.all([
            getAllProblems(),
            getAllChapters(),
        ]);
        if (problemsRes.data) setProblems(problemsRes.data);
        if (topicsRes.data) setTopics(topicsRes.data);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenAddDialog = () => {
        setEditingProblem(null);
        setFormData({
            name: '',
            topic_id: topics[0]?._id || '',
            difficulty: 'easy',
            leetcode_link: '',
            youtube_link: '',
            article_link: '',
            order_index: problems.length + 1,
        });
        setIsDialogOpen(true);
    };

    const handleOpenEditDialog = (problem: Problem) => {
        setEditingProblem(problem);
        setFormData({
            name: problem.name,
            topic_id: typeof problem.topic_id === 'object' ? problem.topic_id._id : problem.topic_id,
            difficulty: problem.difficulty,
            leetcode_link: problem.leetcode_link || '',
            youtube_link: problem.youtube_link || '',
            article_link: problem.article_link || '',
            order_index: problem.order_index,
        });
        setIsDialogOpen(true);
    };

    const handleSave = async () => {
        if (editingProblem) {
            await updateProblem(editingProblem._id, formData);
        } else {
            await createProblem(formData);
        }
        setIsDialogOpen(false);
        fetchData();
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this problem?')) {
            await deleteProblem(id);
            fetchData();
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Problems Management</h1>
                        <p className="text-muted-foreground mt-1">Add and edit DSA problems</p>
                    </div>
                    <Button onClick={handleOpenAddDialog}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Problem
                    </Button>
                </div>

                <div className="glass-card rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[80px]">Order</TableHead>
                                    <TableHead>Problem</TableHead>
                                    <TableHead>Topic</TableHead>
                                    <TableHead>Difficulty</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">
                                            <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                                        </TableCell>
                                    </TableRow>
                                ) : problems.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">
                                            No problems found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    problems.map((problem) => (
                                        <TableRow key={problem._id}>
                                            <TableCell className="font-mono">{problem.order_index}</TableCell>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    {problem.name}
                                                    {problem.leetcode_link && (
                                                        <a href={problem.leetcode_link} target="_blank" rel="noopener noreferrer">
                                                            <ExternalLink className="h-3 w-3 text-muted-foreground hover:text-primary" />
                                                        </a>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {typeof problem.topic_id === 'object' ? problem.topic_id.name : 'Unknown'}
                                            </TableCell>
                                            <TableCell>
                                                <DifficultyBadge difficulty={problem.difficulty} />
                                            </TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button variant="ghost" size="icon" onClick={() => handleOpenEditDialog(problem)}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(problem._id)} className="text-destructive">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{editingProblem ? 'Edit Problem' : 'Add New Problem'}</DialogTitle>
                        <DialogDescription>
                            Enter the details for the DSA problem. All links are optional.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4 sm:grid-cols-2">
                        <div className="grid gap-2 sm:col-span-2">
                            <Label htmlFor="p-name">Problem Name</Label>
                            <Input
                                id="p-name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. Two Sum"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="p-topic">Topic</Label>
                            <Select
                                value={formData.topic_id}
                                onValueChange={(value) => setFormData({ ...formData, topic_id: value })}
                            >
                                <SelectTrigger id="p-topic">
                                    <SelectValue placeholder="Select topic" />
                                </SelectTrigger>
                                <SelectContent>
                                    {topics.map(t => (
                                        <SelectItem key={t._id} value={t._id}>{t.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="p-difficulty">Difficulty</Label>
                            <Select
                                value={formData.difficulty}
                                onValueChange={(value: any) => setFormData({ ...formData, difficulty: value })}
                            >
                                <SelectTrigger id="p-difficulty">
                                    <SelectValue placeholder="Select difficulty" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="easy">Easy</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="hard">Hard</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="p-leetcode">LeetCode Link</Label>
                            <Input
                                id="p-leetcode"
                                value={formData.leetcode_link}
                                onChange={(e) => setFormData({ ...formData, leetcode_link: e.target.value })}
                                placeholder="https://leetcode.com/problems/..."
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="p-youtube">YouTube Link</Label>
                            <Input
                                id="p-youtube"
                                value={formData.youtube_link}
                                onChange={(e) => setFormData({ ...formData, youtube_link: e.target.value })}
                                placeholder="https://youtube.com/watch?v=..."
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="p-article">Article Link</Label>
                            <Input
                                id="p-article"
                                value={formData.article_link}
                                onChange={(e) => setFormData({ ...formData, article_link: e.target.value })}
                                placeholder="https://geeksforgeeks.org/..."
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="p-order">Order Index</Label>
                            <Input
                                id="p-order"
                                type="number"
                                value={formData.order_index}
                                onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
};

export default ProblemsManagement;
