import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import InputError from "@/Components/InputError";
import { DatePicker } from "@/Components/DatePicker";
import { Project } from "@/types";

export default function EditProject({ project }: { project: Project }) {

    const { data, setData, patch, processing, errors, reset } = useForm<{
        name: string;
        description: string;
        status: 'planned' | 'in_progress' | 'completed' | 'archived';
        deadline: Date;
    }>({
        name: project.name,
        description: project.description,
        status: project.status,
        deadline: new Date(project.deadline),
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        patch(route('projects.update', project.id));
    }

    return (
        <AuthenticatedLayout header="Edit Project">
            <Head title="Edit Project" />
            <Card>
                <CardHeader>
                    <CardTitle>Edit Project</CardTitle>
                    <CardDescription>
                        Edit a project
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action="" onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Project name</Label>
                            <Input
                                id="name"
                                name="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                placeholder="Enter project name"
                            />
                            <InputError message={errors.name} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                required
                                placeholder="Enter project description"
                            />
                            <InputError message={errors.description} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                onValueChange={(value) => setData('status', value as 'planned' | 'in_progress' | 'completed' | 'archived')}
                                defaultValue={data.status}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select project status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="planned">Planned</SelectItem>
                                    <SelectItem value="in_progress">In Progress</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="archived">Archived</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.status} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="deadline">Deadline</Label>
                            <DatePicker value={data.deadline || new Date()} onChange={(date) => setData('deadline', date || new Date())} />
                            <InputError message={errors.deadline} />
                        </div>
                        <div >
                            <Button type="submit" disabled={processing}>Update</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </AuthenticatedLayout>
    )
}
