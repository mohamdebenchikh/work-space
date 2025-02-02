import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/Components/ui/alert';

export default function Dashboard() {

    const { success, error } = usePage().props.flash

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className='space-y-4'>

                {success && (
                    <Alert variant="default">
                        <AlertTitle>
                            Success
                        </AlertTitle>
                        <AlertDescription>
                            {success}
                        </AlertDescription>
                    </Alert>
                )}

                {error && (
                    <Alert variant="destructive">
                        <AlertTitle>
                            Error
                        </AlertTitle>
                        <AlertDescription>
                            {error}
                        </AlertDescription>
                    </Alert>
                )}

                <div className="border rounded-lg">
                    <div className="p-6">
                        <p className='mb-4'>You're logged in!</p>
                        <Button asChild>
                            <Link href={route('logout')} method="post">Log out</Link>
                        </Button>
                    </div>


                </div>
            </div>

        </AuthenticatedLayout>
    );
}
