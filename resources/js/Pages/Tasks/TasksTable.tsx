import { DataTable } from "@/Components/DataTable";
import { FacetFilter, Task } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { Check, Clock, Circle, ArrowUp, ArrowRight, ArrowDown, Eye, Edit, TrashIcon } from "lucide-react";
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/Components/ui/dropdown-menu";
import { Link, router } from "@inertiajs/react";
import { DataTableColumnHeader } from "@/Components/DataTableColumnHeader";
import { Checkbox } from "@/Components/ui/checkbox";
import { format } from 'date-fns'
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";



export default function ({ tasks }: { tasks: Task[] }) {

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selecedTaskId, setSelectedTaskId] = useState(0);

    const handleDelete = (taskId: number) => {
        setSelectedTaskId(taskId);
        setShowDeleteDialog(true);
    }

    const confirmDeletion = () => {
        router.delete(route('tasks.destroy', { task: selecedTaskId }),{
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setShowDeleteDialog(false);
            }
        });
    }

    const columns: ColumnDef<Task>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },

        {
            accessorKey: "title",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
        },
        {
            accessorKey: "assigned_to",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Assigned To" />,
            cell: ({ row }) => {
                let assigned_users = row.original.assigned_users;
                return (
                    <div className="flex items-center overflow-hidden -space-x-2">
                        {assigned_users?.map((user) => (
                            <Avatar key={user.id} className="h-6 w-6" >
                                <AvatarImage src={user.photo_url || ''} alt={user.name} />
                                <AvatarFallback className="capitalize">{user.name}</AvatarFallback>
                            </Avatar>
                        ))}
                    </div>
                )
            }
        },
        {
            accessorKey: 'Due Date',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Due Date" />,
            cell: ({ row }) => {
                let dueDate = row.original.due_date;
                return (
                    <span className="capitalize">
                        {dueDate ? format(dueDate, 'do MMMM yyyy') : 'N/A'}
                    </span>
                );
            }
        },
        {
            accessorKey: "progress",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Progress" />,
            cell: ({ row }) => {
                let progress = row.original.progress;
                return (
                    <span className="capitalize">
                        {progress}%
                    </span>
                );
            }
        },
        {
            accessorKey: "status",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
            cell: ({ row }) => {
                let taskStatus: string = row.original.status;
                let icon: React.ReactElement;

                switch (taskStatus) {
                    case 'in_progress':
                        taskStatus = 'in progress';
                        icon = <Clock className="h-4 w-4 mr-1" />;

                        break;
                    case 'completed':
                        icon = <Check className="h-4 w-4 mr-1" />;

                        break;
                    default:
                        icon = <Circle className="h-4 w-4 mr-1" />;
                }

                return (
                    <span className={`capitalize flex items-center gap-1`}>
                        {icon}
                        {taskStatus}
                    </span>
                );
            }
        },
        {
            accessorKey: "priority",
            enableHiding: false,
            enableSorting: false,
            header: ({ column }) => <DataTableColumnHeader column={column} title="Priority" />,
            cell: ({ row }) => {
                let taskPriority: string = row.original.priority;
                let icon: React.ReactElement;

                switch (taskPriority) {
                    case 'high':
                        icon = <ArrowUp className="h-4 w-4 mr-1" />;
                        break;
                    case 'medium':
                        icon = <ArrowRight className="h-4 w-4 mr-1" />;
                        break;
                    case 'low':
                        icon = <ArrowDown className="h-4 w-4 mr-1" />;
                        break;
                    default:
                        icon = <Circle className="h-4 w-4 mr-1" />;
                }

                return (
                    <span className={`capitalize flex items-center gap-1`}>
                        {icon}
                        {taskPriority}
                    </span>
                );
            }
        },
        {
            id: "actions",
            cell: ({ row }) => {
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                                <Link href={route('tasks.show', row.original.id)}>
                                    <Eye className="h-4 w-4 mr-1" /> Show
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem asChild>
                                <Link href={route('tasks.edit', row.original.id)}>
                                    <Edit className="h-4 w-4 mr-1" /> Edit
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem onClick={() => handleDelete(row.original.id)}>
                                <TrashIcon className="h-4 w-4 mr-1" /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            }
        }
    ];


    const facets: FacetFilter[] = [
        {
            column: 'status',
            title: 'Status',
            options: [
                { value: 'in_progress', label: 'In Progress' },
                { value: 'completed', label: 'Completed' },
                { value: 'todo', label: 'To Do' },
            ],
        },
        {
            column: 'priority',
            title: 'Priority',
            options: [
                { value: 'high', label: 'High' },
                { value: 'medium', label: 'Medium' },
                { value: 'low', label: 'Low' },
            ],
        },
    ];

    return (
        <>
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Task</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this task?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button variant="default">Cancel</Button>
                        </DialogClose>
                        <Button onClick={confirmDeletion} variant="destructive">Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <DataTable searchColumn="title" facets={facets} searchPlaceholder="Search by title" data={tasks} columns={columns} />
        </>
    )
}
