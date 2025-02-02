import { Button } from "@/components/ui/button";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import {  PlusIcon } from "lucide-react";
import { PageProps, Task } from "@/types";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import TasksTable from "./TasksTable";

export default function TaskIndex({ tasks }: {
    tasks: Task[]
}) {

    const { success } = usePage<PageProps>().props.flash || {};

    return (
        <AuthenticatedLayout header="Tasks">
            <Head title="Tasks" />
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Tasks</h2>
                <Button asChild>
                    <Link href={route('tasks.create')}>
                        <PlusIcon className='h-4 w-4 ' />
                        <span>New Task</span>
                    </Link>
                </Button>
            </div>
            {success && (
                <Alert className="mb-6">
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>{success}</AlertDescription>
                </Alert>
            )}

            <div className="space-y-4">
                 <TasksTable tasks={tasks} />
            </div>

        </AuthenticatedLayout>
    )
}