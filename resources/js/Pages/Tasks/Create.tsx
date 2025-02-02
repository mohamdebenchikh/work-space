import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import InputError from "@/Components/InputError";
import { Project, TaskPriority, TaskStatus, User } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { DatePicker } from "@/Components/DatePicker";
import { MultiSelect } from "@/Components/MultiSelect";
import { ArrowLeftIcon } from "lucide-react";
import { Link } from "@inertiajs/react";

export default function CreateTask({ projects, teamMembers }: {
    projects: Project[],
    teamMembers: User[],
}) {
    const { data, setData, errors, post, processing } = useForm<{
        title: string;
        description: string;
        priority: TaskPriority;
        status: TaskStatus;
        due_date: string;
        project_id: number;
        assigned_user_ids: number[];
        started_at?: string;
        completed_at?: string;
        notes?: string;
    }>({
        title: "",
        description: "",
        priority: "low",
        status: "todo",
        due_date: "",
        project_id: 1,
        assigned_user_ids: [],
        started_at: "",
        completed_at: "",
        notes: "",
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route("tasks.store"));
    };

    return (
        <AuthenticatedLayout header="Create Task">
            <Head title="Create Task" />
            
            <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <Button variant="ghost" asChild>
                        <Link href={route('tasks.index')} className="gap-2">
                            <ArrowLeftIcon className="h-4 w-4" />
                            Back to Tasks
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">Create New Task</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {/* Task Details Section */}
                            <div className="space-y-4">
                                <h3 className="font-medium text-lg">Task Details</h3>
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <Label htmlFor="title">Title *</Label>
                                        <Input
                                            id="title"
                                            value={data.title}
                                            onChange={(e) => setData("title", e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.title} />
                                    </div>

                                    <div className="space-y-1">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData("description", e.target.value)}
                                            rows={3}
                                        />
                                        <InputError message={errors.description} />
                                    </div>
                                </div>
                            </div>

                            {/* Configuration Section */}
                            <div className="space-y-4">
                                <h3 className="font-medium text-lg">Configuration</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label>Project *</Label>
                                        <Select
                                            value={data.project_id.toString()}
                                            onValueChange={(value) => setData("project_id", Number(value))}
                                            required
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select project" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {projects.map((project) => (
                                                    <SelectItem key={project.id} value={project.id.toString()}>
                                                        {project.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.project_id} />
                                    </div>

                                    <div className="space-y-1">
                                        <Label>Priority *</Label>
                                        <Select
                                            value={data.priority}
                                            onValueChange={(value) => setData("priority", value as TaskPriority)}
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

                                    <div className="space-y-1">
                                        <Label>Status *</Label>
                                        <Select
                                            value={data.status}
                                            onValueChange={(value) => setData("status", value as TaskStatus)}
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

                                    <div className="space-y-1">
                                        <Label>Assigned Team Members</Label>
                                        <MultiSelect
                                            options={teamMembers.map((user) => ({
                                                value: user.id.toString(),
                                                label: user.name
                                            }))}
                                            value={data.assigned_user_ids?.map(String)}
                                            onValueChange={(values) => 
                                                setData("assigned_user_ids", values.map(Number))
                                            }
                                            placeholder="Select team members..."
                                        />
                                        <InputError message={errors.assigned_user_ids} />
                                    </div>
                                </div>
                            </div>

                            {/* Timeline Section */}
                            <div className="space-y-4">
                                <h3 className="font-medium text-lg">Timeline</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-1">
                                        <Label>Due Date</Label>
                                        <DatePicker
                                            value={data.due_date ? new Date(data.due_date) : undefined}
                                            onChange={(date) => setData("due_date", date?.toISOString() || "")}
                                        />
                                        <InputError message={errors.due_date} />
                                    </div>

                                    <div className="space-y-1">
                                        <Label>Start Date</Label>
                                        <DatePicker
                                            value={data.started_at ? new Date(data.started_at) : undefined}
                                            onChange={(date) => setData("started_at", date?.toISOString())}
                                        />
                                        <InputError message={errors.started_at} />
                                    </div>

                                    <div className="space-y-1">
                                        <Label>Completion Date</Label>
                                        <DatePicker
                                            value={data.completed_at ? new Date(data.completed_at) : undefined}
                                            onChange={(date) => setData("completed_at", date?.toISOString())}
                                        />
                                        <InputError message={errors.completed_at} />
                                    </div>
                                </div>
                            </div>

                            {/* Additional Information */}
                            <div className="space-y-4">
                                <h3 className="font-medium text-lg">Additional Information</h3>
                                <div className="space-y-1">
                                    <Label>Notes</Label>
                                    <Textarea
                                        value={data.notes}
                                        onChange={(e) => setData("notes", e.target.value)}
                                        rows={3}
                                        placeholder="Additional notes or comments..."
                                    />
                                    <InputError message={errors.notes} />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end pt-4">
                                <Button 
                                    type="submit" 
                                    disabled={processing}
                                    className="w-full md:w-auto"
                                >
                                    {processing ? 'Creating Task...' : 'Create Task'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}