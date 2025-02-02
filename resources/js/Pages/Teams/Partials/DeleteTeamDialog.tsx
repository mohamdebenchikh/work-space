import { Team } from "@/types";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/Components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/Components/ui/label";
import React from "react";
import { router } from "@inertiajs/react";
import { useToast } from "@/hooks/use-toast";


export default function DeleteTeamDialog({ team, label }: { team: Team, label?: string }) {

    const { toast } = useToast();
    const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
    const [name, setName] = React.useState('');

    const confirmDeletion = () => {
        router.delete(route('teams.destroy', team.id), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                toast({
                    title: 'Team deleted',
                    description: 'The team has been deleted successfully',
                });
                setShowDeleteDialog(false);
            }
        });
    }

    return (
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogTrigger asChild>
                <Button size={label ? 'default' : 'icon'} variant={'destructive'}>
                    <Trash2Icon size={16} />
                    {label ? label : null}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <div className="space-y-6">
                    <DialogHeader>
                        <DialogTitle>Delete Team</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete the team <strong>{team.name}</strong>? This action is permanent and cannot be undone. All users, invitations, and team related data will be deleted.
                            <br />
                            <br />
                            To confirm the deletion of the team, please enter the team name below.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2">
                        <Label htmlFor="name">Team Name</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} name="name" />
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant={'default'}>Cancel</Button>
                        </DialogClose>

                        <Button onClick={confirmDeletion} disabled={name !== team.name} variant={'destructive'}>Delete Team</Button>
                    </DialogFooter>
                </div>

            </DialogContent>
        </Dialog>
    )
}