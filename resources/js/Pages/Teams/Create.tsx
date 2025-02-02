import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Button } from "@/components/ui/button";
import InputError from "@/Components/InputError";


export default function CreateTeam() {

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('teams.store'));
    }


    return (
        <AuthenticatedLayout header="Create Team">
            <Head title="Create Team" />

            <Card>
                <CardHeader>
                    <CardTitle>Create Team</CardTitle>
                    <CardDescription>
                        Create a new team to collaborate with others
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <Label htmlFor="name" >Team name</Label>
                            <Input
                                id="name"
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                placeholder="Name"
                                className="mt-1 block w-full"
                                required
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description" >Description</Label>
                            <Textarea
                                id="description"
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                placeholder="Description"
                                className="mt-1 block w-full"
                            />
                            <InputError message={errors.description} />
                        </div>

                            <Button
                                type="submit"
                                disabled={processing}
                            >
                                Create
                            </Button>
                    </form>
                </CardContent>
            </Card>

        </AuthenticatedLayout>
    )
}
