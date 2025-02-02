import { TeamInvitation } from "@/types";
import InvitationDetailsDialog from "./InvitationDetailsDialog";
import DeleteInviationDialog from "./DeleteInviationDialog";
import { formatDistanceToNow } from "date-fns";

export default function InvitationListItem({ invitation }: { invitation: TeamInvitation }) {


    return (
        <div className="border rounded-lg p-4">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold">{invitation.email}</h3>
                    <p className="text-sm text-muted-foreground">Role: {invitation.role} - {formatDistanceToNow(new Date(invitation.created_at))}</p>
                </div>
                <div className="flex items-center gap-2">
                    <InvitationDetailsDialog invitation={invitation} />
                    <DeleteInviationDialog invitation={invitation} />
                </div>
            </div>
        </div>
    )
}