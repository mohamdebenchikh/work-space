import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";



export default function Pages() {
    return (
        <AuthenticatedLayout header="Pages">
            <Head title="Pages" />

            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Pages</h2>
                <Button asChild>
                    <Link href={route('pages.create')} >
                        <PlusIcon className="h-4 w-4" />
                        <span>Create Page</span>
                    </Link>
                </Button>
            </div>
        </AuthenticatedLayout>
    )
}