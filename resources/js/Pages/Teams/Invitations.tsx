import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Team, TeamInvitation } from "@/types";
import { Head } from "@inertiajs/react";
import InvitationListItem from "./Partials/InvitationListItem";
import { Button } from "@/components/ui/button";
import CreateTeamInvitationDialog from "./Partials/CreateTeamInvitationDialog";


export default function Invitations({
    team,
    invitations
}: {
    team: Team,
    invitations: TeamInvitation[]
}) {
    return (
        <AuthenticatedLayout header="Team Invitations">
            <Head title="Team Invitations" />

            <div className="mb-4 flex justify-between items-center">
                <div></div>
                <CreateTeamInvitationDialog team={team} />
            </div>

            <div className="space-y-6">
                {invitations.map((invitation) => (
                    <InvitationListItem key={invitation.id} invitation={invitation} />
                ))}
            </div>
        </AuthenticatedLayout>
    )
}