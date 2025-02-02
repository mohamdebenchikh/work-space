import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/Components/ui/dialog";
import { TeamInvitation } from "@/types";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

export default function InvitationDetailsDialog({ invitation }: { invitation: TeamInvitation }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">Details</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Invitation Details</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-3 items-center gap-4">
                        <span className="text-sm font-medium text-muted-foreground">Sent by</span>
                        <span className="col-span-2 text-sm">{invitation.user.name}</span>
                    </div>

                    <div className="grid grid-cols-3 items-center gap-4">
                        <span className="text-sm font-medium text-muted-foreground">Status</span>
                        <span className="col-span-2 text-sm capitalize">{invitation.status.toLowerCase()}</span>
                    </div>

                    <div className="grid grid-cols-3 items-center gap-4">
                        <span className="text-sm font-medium text-muted-foreground">Created</span>
                        <span className="col-span-2 text-sm">
                            {formatDistanceToNow(new Date(invitation.created_at))} ago
                        </span>
                    </div>

                    <div className="grid grid-cols-3 items-center gap-4">
                        <span className="text-sm font-medium text-muted-foreground">Role</span>
                        <span className="col-span-2 text-sm capitalize">{invitation.role.toLowerCase()}</span>
                    </div>

                    <div className="grid grid-cols-3 items-center gap-4">
                        <span className="text-sm font-medium text-muted-foreground">Email</span>
                        <span className="col-span-2 text-sm">{invitation.email}</span>
                    </div>

                    {invitation.message?.trim() && (
                        <div className="grid grid-cols-3 items-center gap-4">
                            <span className="text-sm font-medium text-muted-foreground">Message</span>
                            <span className="col-span-2 text-sm">{invitation.message}</span>
                        </div>
                    )}

                    {invitation.accepted_at && (
                        <div className="grid grid-cols-3 items-center gap-4">
                            <span className="text-sm font-medium text-muted-foreground">Accepted</span>
                            <span className="col-span-2 text-sm">
                                {formatDistanceToNow(new Date(invitation.accepted_at))} ago
                            </span>
                        </div>
                    )}

                    {invitation.rejected_at && (
                        <div className="grid grid-cols-3 items-center gap-4">
                            <span className="text-sm font-medium text-muted-foreground">Rejected</span>
                            <span className="col-span-2 text-sm">
                                {formatDistanceToNow(new Date(invitation.rejected_at))} ago
                            </span>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}