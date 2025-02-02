import { Button } from "@/components/ui/button";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { PlusIcon } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/Components/ui/alert";
import { Project } from "@/types";
import { useState } from "react";

import ProjectCard from "./ProjectCard";
import DeleteDialog from "./DeleteDialog";

interface ProjectsProps {
    projects: Project[];
}

const StatusAlert = ({ message, type }: { message: string; type: 'success' | 'error' }) => {
    const variants = {
        success: { variant: 'default' as const, title: 'Success!' },
        error: { variant: 'destructive' as const, title: 'Error' }
    };

    return (
        <Alert variant={variants[type].variant} className="mb-4">
            <AlertTitle>{variants[type].title}</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
        </Alert>
    );
};





export default function Projects({ projects }: ProjectsProps) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const flash = usePage().props.flash || {};
    const { success, error } = flash;
    const { user: authUser } = usePage().props.auth;

    const handleDelete = (projectId: number) => {
        setSelectedProjectId(projectId);
        setShowDeleteDialog(true);
    };

    const confirmDeletion = () => {
        if (selectedProjectId) {
            setIsDeleting(true);
            router.delete(route('projects.destroy', selectedProjectId), {
                preserveScroll: true,
                onSuccess: () => {
                    setShowDeleteDialog(false);
                    setSelectedProjectId(null);
                },
                onFinish: () => setIsDeleting(false)
            });
        }
    };

    return (
        <AuthenticatedLayout header="Projects">
            <Head title="Projects" />

            <DeleteDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                onConfirm={confirmDeletion}
                isDeleting={isDeleting}
            />

            <div className="flex items-center justify-between mb-6 gap-4">
                <h1 className="text-2xl font-bold tracking-tight">Project Management</h1>
                <Button asChild>
                    <Link
                        href={route('projects.create')}
                        className="gap-2"
                        aria-label="Create new project"
                    >
                        <PlusIcon className="h-4 w-4" />
                        <span className="hidden sm:inline">New Project</span>
                    </Link>
                </Button>
            </div>

            {success && <StatusAlert message={success} type="success" />}
            {error && <StatusAlert message={error} type="error" />}

            {projects.length === 0 ? (
                <div className="text-center py-12 border rounded-lg bg-muted/20">
                    <p className="text-muted-foreground">No projects found. Create your first project!</p>
                </div>
            ) : (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            authUser={authUser}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}
        </AuthenticatedLayout>
    );
}