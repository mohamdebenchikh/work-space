import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { Team } from "@/types";
import CreateTeamDialog from "./Partials/CreateTeamDialog";
import DeleteTeamDialog from "./Partials/DeleteTeamDialog";
import { Button } from "@/components/ui/button";
import { Edit, Mail, UsersIcon } from "lucide-react";
import { Badge } from "@/Components/ui/badge";


export default function TeamsIndex({ teams }: { teams: Team[] }) {

    return (
        <AuthenticatedLayout header="Teams">

            <Head title="Teams" />

            <div className="mb-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">Teams</h1>
                <CreateTeamDialog />
            </div>

            <div className="space-y-4">
                {teams.map((team) => (
                    <div key={team.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-lg font-semibold">{team.name} <Badge variant="secondary" className="rounded-full">{team.currentUserRole}</Badge> </h2>
                                <p className="text-sm text-muted-foreground">{team.description}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button asChild variant={'outline'}>
                                    <Link href={route('team.members.index', team.id)}>
                                        <UsersIcon size={16} />
                                        Members
                                    </Link>
                                </Button>
                                {(team.currentUserRole === 'owner' || team.currentUserRole === 'admin') && (
                                    <>
                                        <Button variant={'outline'} asChild>
                                            <Link href={route('team.invitations.index', team.id)}>
                                                <Mail size={16} />
                                                Invitations</Link>
                                        </Button>
                                        <Link href={route('teams.edit', team.id)}>
                                            <Button variant="outline" size={'icon'}>
                                                <Edit size={16} />
                                            </Button>
                                        </Link>
                                    </>)}
                                {team.currentUserRole === 'owner' && <DeleteTeamDialog team={team} />}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </AuthenticatedLayout>
    )
}