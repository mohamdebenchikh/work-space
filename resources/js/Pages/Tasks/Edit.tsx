import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Task, TaskPriority, TaskStatus } from "@/types";
import { Head, router, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import InputError from "@/Components/InputError";
import { Label } from "@/Components/ui/label";
import { DatePicker } from "@/Components/DatePicker";
import { RefreshCcwIcon, SaveIcon, Trash2Icon } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/Components/ui/dialog";

export default function EditTask({ task }: { task: Task }) {
    const { data, setData, put, processing, errors, reset } = useForm<{
        title: string;
        description: string;
        notes?: string;
        status: TaskStatus;
        priority: TaskPriority;
        due_date?: string;
        started_at?: string;
        completed_at?: string;
        progress: number;
    }>({
        title: task.title,
        description: task.description,
        notes: task.notes ?? undefined,
        status: task.status,
        priority: task.priority,
        due_date: task.due_date ?? undefined,
        started_at: task.started_at ?? undefined,
        completed_at: task.completed_at ?? undefined,
        progress: task.progress,
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(route('tasks.update', task.id));
    };

    const handleReset = () => reset();
    const handleDelete = () => router.delete(route('tasks.destroy', task.id));

    return (
        <AuthenticatedLayout header="Edit Task">
            <Head title="Edit Task" />

            {/* Fixed Header Container */}
            <div className="sticky top-0 bg-background z-10 py-4 border-b">
                <div className="flex flex-wrap gap-2 justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleReset}
                        className="gap-2"
                    >
                        <RefreshCcwIcon className="h-4 w-4" />
                        <span className="sr-only sm:not-sr-only">Reset</span>
                    </Button>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="destructive" className="gap-2">
                                <Trash2Icon className="h-4 w-4" />
                                <span className="sr-only sm:not-sr-only">Delete</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Delete Task</DialogTitle>
                                <DialogDescription>
                                    Are you sure you want to delete this task? This action is irreversible.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="gap-2">
                                <DialogClose asChild>
                                    <Button type="button" variant="outline">
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button type="button" variant="destructive" onClick={handleDelete}>
                                    Delete
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Button
                        type="submit"
                        disabled={processing}
                        className="gap-2"
                        form="task-form"
                    >
                        <SaveIcon className="h-4 w-4" />
                        <span className="sr-only sm:not-sr-only">
                            {processing ? 'Saving...' : 'Save Changes'}
                        </span>
                    </Button>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                {/* Task Details Card */}
                <Card className="h-fit">
                    <CardHeader>
                        <CardTitle className="text-lg">Task Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} id="task-form" className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Title *</Label>
                                    <Input
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="Enter task title"
                                        required
                                    />
                                    <InputError message={errors.title} />
                                </div>

                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Textarea
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows={4}
                                        placeholder="Add task description"
                                    />
                                    <InputError message={errors.description} />
                                </div>

                                <div className="space-y-2">
                                    <Label>Notes</Label>
                                    <Textarea
                                        value={data.notes || ''}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        rows={3}
                                        placeholder="Additional notes..."
                                    />
                                    <InputError message={errors.notes} />
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Task Settings Card */}
                <Card className="h-fit">
                    <CardHeader>
                        <CardTitle className="text-lg">Task Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Status</Label>
                                <Select
                                    value={data.status}
                                    onValueChange={(v) => setData('status', v as TaskStatus)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="todo">To Do</SelectItem>
                                        <SelectItem value="in_progress">In Progress</SelectItem>
                                        <SelectItem value="done">Done</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.status} />
                            </div>

                            <div className="space-y-2">
                                <Label>Priority</Label>
                                <Select
                                    value={data.priority}
                                    onValueChange={(v) => setData('priority', v as TaskPriority)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select priority" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="low">Low</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="high">High</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.priority} />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Due Date</Label>
                                <div className="w-full">
                                    <DatePicker
                                        value={data.due_date ? new Date(data.due_date) : undefined}
                                        onChange={(d) => setData('due_date', d?.toISOString())}
                                    />
                                </div>
                                <InputError message={errors.due_date} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Start Date</Label>
                                    <div className="w-full">
                                        <DatePicker
                                            value={data.started_at ? new Date(data.started_at) : undefined}
                                            onChange={(d) => setData('started_at', d?.toISOString())}
                                        />
                                    </div>
                                    <InputError message={errors.started_at} />
                                </div>

                                <div className="space-y-2">
                                    <Label>Completion Date</Label>
                                    <div className="w-full">
                                        <DatePicker
                                            value={data.completed_at ? new Date(data.completed_at) : undefined}
                                            onChange={(d) => setData('completed_at', d?.toISOString())}
                                        />
                                    </div>
                                    <InputError message={errors.completed_at} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Progress</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={data.progress}
                                    onChange={(e) => setData('progress', parseInt(e.target.value))}
                                    className="w-24"
                                />
                                <span className="text-muted-foreground">%</span>
                            </div>
                            <InputError message={errors.progress} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    )
}