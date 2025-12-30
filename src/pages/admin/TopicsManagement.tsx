import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminApi, Topic } from '@/hooks/useAdminApi';
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
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';

const TopicsManagement = () => {
    const { getAllChapters, createChapter, updateChapter, deleteChapter } = useAdminApi();
    const [topics, setTopics] = useState<Topic[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingTopic, setEditingTopic] = useState<Topic | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        order_index: 0,
    });

    const fetchTopics = async () => {
        setLoading(true);
        const { data } = await getAllChapters();
        if (data) setTopics(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchTopics();
    }, []);

    const handleOpenAddDialog = () => {
        setEditingTopic(null);
        setFormData({ name: '', description: '', order_index: topics.length + 1 });
        setIsDialogOpen(true);
    };

    const handleOpenEditDialog = (topic: Topic) => {
        setEditingTopic(topic);
        setFormData({
            name: topic.name,
            description: topic.description || '',
            order_index: topic.order_index,
        });
        setIsDialogOpen(true);
    };

    const handleSave = async () => {
        if (editingTopic) {
            await updateChapter(editingTopic._id, formData);
        } else {
            await createChapter(formData);
        }
        setIsDialogOpen(false);
        fetchTopics();
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this topic?')) {
            await deleteChapter(id);
            fetchTopics();
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Topics Management</h1>
                        <p className="text-muted-foreground mt-1">Create and manage DSA topics</p>
                    </div>
                    <Button onClick={handleOpenAddDialog}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Topic
                    </Button>
                </div>

                <div className="glass-card rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">Order</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center">
                                            <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                                        </TableCell>
                                    </TableRow>
                                ) : topics.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center">
                                            No topics found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    topics.map((topic) => (
                                        <TableRow key={topic._id}>
                                            <TableCell className="font-mono">{topic.order_index}</TableCell>
                                            <TableCell className="font-medium">{topic.name}</TableCell>
                                            <TableCell className="max-w-md truncate">{topic.description}</TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button variant="ghost" size="icon" onClick={() => handleOpenEditDialog(topic)}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(topic._id)} className="text-destructive">
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
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingTopic ? 'Edit Topic' : 'Add New Topic'}</DialogTitle>
                        <DialogDescription>
                            Fill in the details for the DSA topic.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. Arrays & Hashing"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Topic overview..."
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="order_index">Order Index</Label>
                            <Input
                                id="order_index"
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

export default TopicsManagement;
