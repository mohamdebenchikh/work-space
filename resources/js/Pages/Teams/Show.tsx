import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function ShowTeam() {
    return (
        <AuthenticatedLayout header="Show Team">

            <Head title="Show Team" />

            <h1>Show Team</h1>
        </AuthenticatedLayout>
    )
}