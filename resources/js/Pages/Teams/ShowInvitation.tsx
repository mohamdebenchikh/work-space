import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/Components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { TeamInvitation } from "@/types";
import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";

export default function ShowInvitation({
    invitation
}: {
    invitation: TeamInvitation
}) {
    return (
        <AuthenticatedLayout header="Show Invitation" >

            <Head title="Show Invitation" />

            <Card>
                <CardHeader>
                    <CardTitle>Team Invitation</CardTitle>
                    <CardDescription>
                        You have been invited to join {invitation.team.name} as {invitation.role} - {formatDistanceToNow(new Date(invitation.created_at))}
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {invitation.message && <p className="mb-4">
                        {invitation.message}
                    </p>}

                    <p className="text-sm">
                        If you accept the invitation, you will be able to view and interact with the team's resources. If you reject the invitation, the invitation will be deleted and you will not be able to view or interact with the team's resources.
                    </p>
                </CardContent>

                <CardFooter className="gap-2">
                    <Button asChild>
                        <Link href={route('team.invitations.accept', invitation.accept_token)}>Accept Invitation</Link>
                    </Button>
                    <Button asChild variant={'destructive'}>
                        <Link href={route('team.invitations.reject', invitation.reject_token)}>Reject Invitation</Link>
                    </Button>
                </CardFooter>
            </Card>

        </AuthenticatedLayout>
    )
}

