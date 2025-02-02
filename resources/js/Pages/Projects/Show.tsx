import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Project } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, CalendarIcon, EditIcon, TimerIcon, TrashIcon, UserIcon, UsersIcon } from "lucide-react";
import { formatDistanceToNow, isBefore } from "date-fns";
import { Badge } from "@/Components/ui/badge";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import DeleteDialog from "./DeleteDialog";

export default function ShowProject({ project }: { project: Project }) {
    const { auth } = usePage().props;
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const flash = usePage().props.flash || {};

    const statusVariants = {
        planned: 'border-blue-300 bg-blue-50 text-blue-800',
        in_progress: 'border-yellow-300 bg-yellow-50 text-yellow-800',
        completed: 'border-green-300 bg-green-50 text-green-800',
        archived: 'border-gray-300 bg-gray-50 text-gray-800',
    };

    const handleDelete = () => {
        setIsDeleting(true);
        router.delete(route('projects.destroy', project.id), {
            preserveScroll: true,
            onSuccess: () => setShowDeleteDialog(false),
            onFinish: () => setIsDeleting(false),
        });
    };

    return (
        <AuthenticatedLayout header={`Project: ${project.name}`}>
            <Head title={`${project.name}`} />

            {/* Delete Dialog */}
            <DeleteDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog} onConfirm={handleDelete} isDeleting={isDeleting} />

            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <Button variant="ghost" asChild>
                        <Link
                            href={route('projects.index')}
                            className="gap-2 hover:bg-accent/50"
                            aria-label="Back to projects"
                        >
                            <ArrowLeftIcon className="h-4 w-4" />
                            <span className="hidden sm:inline">Back to Projects</span>
                        </Link>
                    </Button>

                    {auth.user.id === project.user_id && (
                        <div className="flex gap-2">
                            <Button asChild variant="outline">
                                <Link
                                    href={route('projects.edit', project.id)}
                                    className="gap-2"
                                    aria-label="Edit project"
                                >
                                    <EditIcon className="h-4 w-4" />
                                    <span className="hidden sm:inline">Edit</span>
                                </Link>
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() => setShowDeleteDialog(true)}
                                aria-label="Delete project"
                            >
                                <TrashIcon className="h-4 w-4" />
                                <span className="hidden sm:inline">Delete</span>
                            </Button>
                        </div>
                    )}
                </div>

                {/* Flash Messages */}
                {flash.success && (
                    <Alert variant="default">
                        <AlertTitle>Success!</AlertTitle>
                        <AlertDescription>{flash.success}</AlertDescription>
                    </Alert>
                )}
                {flash.error && (
                    <Alert variant="destructive">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{flash.error}</AlertDescription>
                    </Alert>
                )}

                {/* Main Content */}
                <Card className="overflow-hidden">
                    <CardHeader className="border-b p-4">
                        <div className="space-y-2">
                            <CardTitle className="text-xl font-semibold">
                                {project.name}
                            </CardTitle>
                            {project.description && (
                                <CardDescription className="text-base text-foreground/80">
                                    {project.description}
                                </CardDescription>
                            )}
                        </div>
                    </CardHeader>

                    <CardContent className="p-6 space-y-6">
                        {/* Metadata Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                                <Badge
                                    className={cn(
                                        "rounded-full text-sm font-medium capitalize",
                                        statusVariants[project.status]
                                    )}
                                >
                                    {project.status.replace('_', ' ')}
                                </Badge>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                                <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Deadline</p>
                                    <span className={cn(
                                        "font-medium",
                                        project.deadline && isBefore(new Date(project.deadline), new Date())
                                            ? 'text-destructive'
                                            : 'text-foreground'
                                    )}>
                                        {project.deadline
                                            ? formatDistanceToNow(new Date(project.deadline), { addSuffix: true })
                                            : 'No deadline set'}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                                <TimerIcon className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Created</p>
                                    <span className="font-medium">
                                        {formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                                <UserIcon className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Owner</p>
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-6 w-6">
                                            <AvatarImage
                                                src={project.user?.photo_url ?? ""}
                                                alt={project.user.name}
                                            />
                                            <AvatarFallback className="text-xs bg-primary/10">
                                                {project.user.name.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium">
                                            {project.user?.name}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Team Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-lg font-semibold">
                                <UsersIcon className="h-5 w-5" />
                                <h3>Team Members</h3>
                            </div>
                            <div className="flex flex-wrap gap-4">
                                {project.team?.members?.map((member) => (
                                    <div key={member.id} className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={member.photo_url ?? ""} alt={member.name} />
                                            <AvatarFallback className="bg-primary/10">
                                                {member.name.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{member.name}</p>
                                            <p className="text-sm text-muted-foreground">{member.email}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tasks Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-lg font-semibold">
                                <TimerIcon className="h-5 w-5" />
                                <h3>Project Tasks</h3>
                                <Badge variant="outline" className="ml-2">
                                    {project.tasks_count} tasks
                                </Badge>
                            </div>
                            {/* Add task list component here */}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    )
}