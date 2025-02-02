import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Team, TeamInvitation } from "@/types";

import InvitationListItem from "./InvitationListItem";
import CreateTeamInvitationDialog from "./CreateTeamInvitationDialog";


export default function TeamInvitations({ team, invitations }: { team: Team, invitations: TeamInvitation[] }) {

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="max-w-xl">
                        <CardTitle>Pending Invitations</CardTitle>
                    </div>
                    <div className="flex items-center">
                        <CreateTeamInvitationDialog team={team} />
                    </div>
                </div>

            </CardHeader>

            <CardContent>
                <div className="space-y-4">
                    {invitations.map((invitation) => (
                        <InvitationListItem key={invitation.id} invitation={invitation} />
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}