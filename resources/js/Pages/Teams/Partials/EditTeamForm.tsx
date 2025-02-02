import { Team } from "@/types";
import { useForm } from "@inertiajs/react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import InputError from "@/Components/InputError";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function EditTeam({ team }: { team: Team }) {

    const { toast } = useToast();
    const { data, setData, put, processing, errors, reset } = useForm({
        name: team.name,
        description: team.description
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(route('teams.update', team.id), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                toast({
                    title: 'Team updated',
                    description: 'The team has been updated successfully',
                });            }
        });
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Edit Team</CardTitle>
                <CardDescription>Edit the team details</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="max-w-xl">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                            <InputError message={errors.name} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} />
                            <InputError message={errors.description} />
                        </div>
                        <div>
                            <Button type="submit" variant="default" disabled={processing}>Save Change</Button>
                        </div>
                    </form>
                </div>
            </CardContent>
        </Card>

    )
}