import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Team, TeamInvitation } from "@/types";
import { Head } from "@inertiajs/react";
import EditTeamForm from "./Partials/EditTeamForm";
import DeleteTeamDialog from "./Partials/DeleteTeamDialog";
import TeamInvitations from "./Partials/TeamInvitations";

export default function EditTeam({ team,invitations }: { team: Team, invitations: TeamInvitation[] }) {

    return (
        <AuthenticatedLayout header="Edit Team">

            <Head title="Edit Team" />

            <div className="space-y-6">
                {team.currentUserRole === 'owner' && <div className="flex justify-between items-center">
                    <div></div>
                    <DeleteTeamDialog team={team} label="Delete Team" />
                </div>}
                <EditTeamForm team={team} />
                <TeamInvitations team={team} invitations={invitations} />
            </div>

        </AuthenticatedLayout>
    )
}