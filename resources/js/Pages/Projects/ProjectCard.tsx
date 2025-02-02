import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/Components/ui/dropdown-menu";
import { EditIcon, EyeIcon, MoreHorizontal, MoreVerticalIcon, TrashIcon } from "lucide-react";
import { Link } from "@inertiajs/react";
import { Project } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { isBefore } from "date-fns";
import { Button } from "@/components/ui/button";
import {Avatar, AvatarFallback, AvatarImage} from "@/Components/ui/avatar";
import { Badge } from "@/Components/ui/badge";
import { cn } from "@/lib/utils";



const ProjectCard = ({
    project,
    authUser,
    onDelete
}: {
    project: Project;
    authUser: any;
    onDelete: (id: number) => void;
}) => {
    const statusLabel = {
        planned: 'Planned',
        in_progress: 'In Progress',
        completed: 'Completed',
        archived: 'Archived'
    }[project.status];

    const isDeadlinePassed = project.deadline && isBefore(new Date(project.deadline), new Date());
    const deadlineText = project.deadline 
        ? `${formatDistanceToNow(new Date(project.deadline), { addSuffix: true })}`
        : 'No deadline';

    return (
        <Card className="group hover:shadow-lg transition-shadow h-full flex flex-col">
            <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg truncate" title={project.name}>
                        <Link 
                            href={route('projects.show', project.id)} 
                            className="hover:underline focus:ring-2 focus:ring-primary rounded-md"
                        >
                            {project.name}
                        </Link>
                    </CardTitle>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-accent/50"
                                aria-label="Project actions"
                                aria-haspopup="true"
                            >
                                <MoreVerticalIcon className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                                <Link
                                    href={route('projects.show', project.id)}
                                    className="flex items-center hover:bg-muted/50"
                                    aria-label="View project"
                                >
                                    <EyeIcon className="h-4 w-4 mr-2" />
                                    View
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link
                                    href={route('projects.edit', project.id)}
                                    className="flex items-center hover:bg-muted/50"
                                    aria-label="Edit project"
                                >
                                    <EditIcon className="h-4 w-4 mr-2" />
                                    Edit
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => onDelete(project.id)}
                                className="text-destructive focus:text-destructive flex items-center hover:bg-destructive/10"
                                aria-label="Delete project"
                            >
                                <TrashIcon className="h-4 w-4 mr-2" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-0 flex-1 flex flex-col">
                {project.description && (
                    <CardDescription 
                        className="line-clamp-3 mb-3 text-foreground/80"
                        title={project.description}
                    >
                        {project.description}
                    </CardDescription>
                )}
                
                <div className="flex flex-wrap gap-2 mb-3">
                    <Badge 
                        variant="outline" 
                        className={cn(
                            "rounded-full capitalize",
                            project.status === 'in_progress' && "border-blue-300 text-blue-800 bg-blue-50",
                            project.status === 'completed' && "border-green-300 text-green-800 bg-green-50",
                            project.status === 'archived' && "border-gray-300 text-gray-800 bg-gray-50"
                        )}
                    >
                        {statusLabel}
                    </Badge>
                    <Badge 
                        variant="outline" 
                        className="rounded-full bg-purple-50 text-purple-800 border-purple-300"
                    >
                        {project.tasks_count} {project.tasks_count === 1 ? 'task' : 'tasks'}
                    </Badge>
                </div>

                <div className="mt-auto space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Deadline:</span>
                        <span 
                            className={cn(
                                "font-medium",
                                isDeadlinePassed ? "text-destructive" : "text-foreground/80"
                            )}
                            title={project.deadline ? new Date(project.deadline).toLocaleDateString() : undefined}
                        >
                            {deadlineText}
                        </span>
                    </div>
                    
                    <div className="flex items-center gap-2 pt-2 border-t">
                        <Avatar className="h-7 w-7">
                            <AvatarImage 
                                src={project.user?.photo_url ?? undefined} 
                                alt={project.user.name} 
                            />
                            <AvatarFallback className="bg-primary/10 text-primary">
                                {project.user.name.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col leading-tight">
                            <span className="text-sm font-medium">
                                {project.user.id === authUser?.id ? 'You' : project.user.name}
                            </span>
                            <time 
                                className="text-xs text-muted-foreground"
                                dateTime={project.created_at}
                                title={new Date(project.created_at).toLocaleString()}
                            >
                                Created {formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}
                            </time>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ProjectCard;