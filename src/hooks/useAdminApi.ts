import { useAuth } from './useAuth';
import { useToast } from './use-toast';


export interface Topic {
    _id: string;
    name: string;
    description: string | null;
    order_index: number;
    created_at: string;
}

export interface Problem {
    _id: string;
    topic_id: string | { _id: string; name: string };
    name: string;
    difficulty: 'easy' | 'medium' | 'hard';
    youtube_link: string | null;
    leetcode_link: string | null;
    codeforces_link: string | null;
    article_link: string | null;
    order_index: number;
    created_at: string;
}

export interface CreateTopicInput {
    name: string;
    description?: string;
    order_index: number;
}

export interface CreateProblemInput {
    topic_id: string;
    name: string;
    difficulty: 'easy' | 'medium' | 'hard';
    youtube_link?: string;
    leetcode_link?: string;
    codeforces_link?: string;
    article_link?: string;
    order_index: number;
}

export const useAdminApi = () => {
    const { isAdmin, loading } = useAuth();
    const { toast } = useToast();

    const getHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    };

    const checkAdmin = () => {
        if (loading) return false;

        if (!isAdmin) {
            toast({
                variant: 'destructive',
                title: 'Unauthorized',
                description: 'You must be an admin to perform this action.',
            });
            return false;
        }
        return true;
    };


    const createChapter = async (input: CreateTopicInput) => {
        if (!checkAdmin()) return { data: null, error: new Error('Unauthorized') };

        try {
            const response = await fetch('/api/topics', {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(input),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to create topic');

            toast({ title: 'Success', description: 'Topic created successfully' });
            return { data, error: null };
        } catch (err: any) {
            toast({ variant: 'destructive', title: 'Error', description: err.message });
            return { data: null, error: err };
        }
    };

    const updateChapter = async (id: string, input: any) => {
        if (!checkAdmin()) return { data: null, error: new Error('Unauthorized') };

        try {
            const response = await fetch(`/api/topics/${id}`, {
                method: 'PATCH',
                headers: getHeaders(),
                body: JSON.stringify(input),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to update topic');

            toast({ title: 'Success', description: 'Topic updated successfully' });
            return { data, error: null };
        } catch (err: any) {
            toast({ variant: 'destructive', title: 'Error', description: err.message });
            return { data: null, error: err };
        }
    };

    const deleteChapter = async (id: string) => {
        if (!checkAdmin()) return { error: new Error('Unauthorized') };

        try {
            const response = await fetch(`/api/topics/${id}`, {
                method: 'DELETE',
                headers: getHeaders(),
            });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to delete topic');
            }

            toast({ title: 'Success', description: 'Topic deleted successfully' });
            return { error: null };
        } catch (err: any) {
            toast({ variant: 'destructive', title: 'Error', description: err.message });
            return { error: err };
        }
    };

    const getAllChapters = async () => {
        try {
            const response = await fetch('/api/topics');
            const data = await response.json();
            return { data, error: null };
        } catch (err: any) {
            return { data: null, error: err };
        }
    };

    const getChapter = async (id: string) => {
        try {
            const response = await fetch(`/api/topics/${id}`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to fetch topic');
            return { data, error: null };
        } catch (err: any) {
            return { data: null, error: err };
        }
    };


    const createProblem = async (input: CreateProblemInput) => {
        if (!checkAdmin()) return { data: null, error: new Error('Unauthorized') };

        try {
            const response = await fetch('/api/problems', {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(input),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to create problem');

            toast({ title: 'Success', description: 'Problem created successfully' });
            return { data, error: null };
        } catch (err: any) {
            toast({ variant: 'destructive', title: 'Error', description: err.message });
            return { data: null, error: err };
        }
    };

    const updateProblem = async (id: string, input: any) => {
        if (!checkAdmin()) return { data: null, error: new Error('Unauthorized') };

        try {
            const response = await fetch(`/api/problems/${id}`, {
                method: 'PATCH',
                headers: getHeaders(),
                body: JSON.stringify(input),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to update problem');

            toast({ title: 'Success', description: 'Problem updated successfully' });
            return { data, error: null };
        } catch (err: any) {
            toast({ variant: 'destructive', title: 'Error', description: err.message });
            return { data: null, error: err };
        }
    };

    const deleteProblem = async (id: string) => {
        if (!checkAdmin()) return { error: new Error('Unauthorized') };

        try {
            const response = await fetch(`/api/problems/${id}`, {
                method: 'DELETE',
                headers: getHeaders(),
            });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to delete problem');
            }

            toast({ title: 'Success', description: 'Problem deleted successfully' });
            return { error: null };
        } catch (err: any) {
            toast({ variant: 'destructive', title: 'Error', description: err.message });
            return { error: err };
        }
    };

    const getAllProblems = async () => {
        try {
            const response = await fetch('/api/problems');
            const data = await response.json();
            return { data, error: null };
        } catch (err: any) {
            return { data: null, error: err };
        }
    };

    const getProblem = async (id: string) => {
        try {
            const response = await fetch(`/api/problems/${id}`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to fetch problem');
            return { data, error: null };
        } catch (err: any) {
            return { data: null, error: err };
        }
    };

    const getProblemsByChapter = async (topicId: string) => {
        try {
            const response = await fetch(`/api/problems/topic/${topicId}`);
            const data = await response.json();
            return { data, error: null };
        } catch (err: any) {
            return { data: null, error: err };
        }
    };

    const getUsersProgress = async () => {
        if (!checkAdmin()) return { data: null, error: new Error('Unauthorized') };

        try {
            const response = await fetch('/api/progress/admin/summary', {
                headers: getHeaders(),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to fetch users progress');
            return { data, error: null };
        } catch (err: any) {
            return { data: null, error: err };
        }
    };

    return {
        isAdmin,
        createChapter,
        updateChapter,
        deleteChapter,
        getAllChapters,
        getChapter,
        createProblem,
        updateProblem,
        deleteProblem,
        getAllProblems,
        getProblem,
        getProblemsByChapter,
        getUsersProgress,
    };
};
