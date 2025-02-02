import { Dialog, DialogFooter, DialogTrigger,DialogContent,DialogHeader,DialogTitle,DialogDescription, DialogClose } from "@/Components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TeamInvitation } from "@/types";
import { router } from "@inertiajs/react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";


export default function DeleteInviationDialog({invitation}: {
    invitation: TeamInvitation
}) {

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const { toast } = useToast();

    const confirmDeletion = () => {
        router.delete(route('team.invitations.destroy', {
            team: invitation.team_id,
            invitation: invitation.id
        }), {
            preserveScroll: true,
            onSuccess: () => {
                toast({
                    title: 'Invitation deleted',
                    description: 'The invitation has been deleted successfully',
                });
                setShowDeleteDialog(false);
            }
        });
    }

    return (
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogTrigger asChild>
                <Button variant="destructive" size={"sm"}>Delete</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Invitation</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this invitation?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2">
                    <DialogClose asChild>
                        <Button>Cancel</Button>
                    </DialogClose>
                    <Button onClick={confirmDeletion} variant={"destructive"}>
                        Yes, Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}