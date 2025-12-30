import { ReactNode, useState } from 'react';
import { Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, ListChecks, FolderTree, LogOut, Code2, Menu, Loader2 } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface AdminLayoutProps {
    children: ReactNode;
}

const navItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/topics', label: 'Topics', icon: FolderTree },
    { path: '/admin/problems', label: 'Problems', icon: ListChecks },
];

export const AdminLayout = ({ children }: AdminLayoutProps) => {
    const { isAdmin, loading, signOut } = useAuth();
    const location = useLocation();
    const [open, setOpen] = useState(false);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    const NavContent = () => (
        <div className="flex flex-col h-full bg-card">
            <div className="p-6 border-b border-border hidden lg:block">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Code2 className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h2 className="font-bold text-lg">DSA Hub</h2>
                        <p className="text-xs text-muted-foreground">Admin Panel</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                        <Link key={item.path} to={item.path} onClick={() => setOpen(false)}>
                            <Button
                                variant={isActive ? 'default' : 'ghost'}
                                className="w-full justify-start h-11"
                            >
                                <Icon className="mr-3 h-4 w-4" />
                                {item.label}
                            </Button>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-border">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 h-11"
                    onClick={() => signOut()}
                >
                    <LogOut className="mr-3 h-4 w-4" />
                    Logout
                </Button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="fixed top-0 left-0 right-0 h-16 border-b border-border bg-card/80 backdrop-blur-md z-50 flex items-center justify-between px-4 lg:px-8">
                <div className="flex items-center gap-3">
                    <div className="lg:hidden flex items-center gap-2">
                        <Code2 className="w-6 h-6 text-primary" />
                        <span className="font-bold">DSA Hub Admin</span>
                    </div>
                    <div className="hidden lg:block text-sm text-muted-foreground font-medium">
                        Administrator Access
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="lg:hidden">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 w-64 border-r border-border">
                            <NavContent />
                        </SheetContent>
                    </Sheet>
                </div>
            </header>

            <div className="flex flex-1 pt-16">
                <aside className="hidden lg:flex fixed left-0 top-16 bottom-0 w-64 bg-card border-r border-border flex-col">
                    <NavContent />
                </aside>

                <main className="flex-1 lg:ml-64 p-4 md:p-8 min-w-0 w-full overflow-hidden">
                    <div className="max-w-7xl mx-auto w-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};
