import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/Components/ui/dialog";
import { Label } from "@/Components/ui/label";
import { Input } from "@/components/ui/input";
import InputError from "@/Components/InputError";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/Components/ui/textarea";
import { useForm } from "@inertiajs/react";
import React from "react";


export default function CreateTeamDialog() {

    const { toast } = useToast();
    const [showCreateDialog, setShowCreateDialog] = React.useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        description: ''
    });


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('teams.store'), {
            preserveScroll: true,
            onSuccess: () => {
                toast({
                    title: 'Team created',
                    description: 'The team has been created successfully',
                });
                reset();
            }
        });
    }


    return (
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
                <Button variant={'outline'}>
                    <Plus size={16} />
                    Create Team
                </Button>
            </DialogTrigger>
            <DialogContent>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Create Team</DialogTitle>
                        <DialogDescription>
                            Create a new team to collaborate with your team members.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            name="name"
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        <InputError message={errors.name} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            name="description"
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                        />
                        <InputError message={errors.description} />
                    </div>
                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button variant={'outline'} type="reset">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing}>Create</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}