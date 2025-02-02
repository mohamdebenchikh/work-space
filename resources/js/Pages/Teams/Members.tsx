import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Team, User } from "@/types";
import { Head, usePage, router } from "@inertiajs/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/Components/ui/dialog";
import { useState } from "react";
import CreateTeamInvitationDialog from "./Partials/CreateTeamInvitationDialog";

export default function Members({ team, members }: {
    team: Team,
    members: (User & {
        pivot: {
            role: 'member' | 'owner' | 'admin'
        }
    })[]
}) {
    const { user } = usePage().props.auth;
    const [showRemoveMemberModal, setShowRemoveMemberModal] = useState(false);
    const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);

    const currentUserRole = members.find(m => m.id === user.id)?.pivot.role;

    const isOwner = currentUserRole === 'owner';
    const isAdmin = currentUserRole === 'admin';

    const handleRoleChange = async (memberId: number, newRole: 'member' | 'admin') => {
        router.patch(route('team.members.update', { team: team.id, user: memberId }), {
            role: newRole
        });
    };

    const handleRemoveMember = (memberId: number) => {
        setSelectedMemberId(memberId);
        setShowRemoveMemberModal(true);
    };

    const confirmRemoveMember = () => {
        if (selectedMemberId) {
            router.delete(route('team.members.destroy', { team: team.id, user: selectedMemberId }));
            setShowRemoveMemberModal(false);
        }
    };

    const handleLeaveTeam = () => {
        if (confirm('Are you sure you want to leave the team?')) {
            router.delete(route('team.members.leave', { team: team.id }));
        }
    };

    return (
        <AuthenticatedLayout header="Members">
            <Head title="Members" />
            <Dialog open={showRemoveMemberModal} onOpenChange={setShowRemoveMemberModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Remove member</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to remove this member?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button variant="default">Cancel</Button>
                        </DialogClose>
                        <Button onClick={confirmRemoveMember} variant="destructive">Remove</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <div className="mb-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold">Members</h2>
                <CreateTeamInvitationDialog team={team} />
            </div>
            <div className="space-y-4">
                {members.map((member) => {

                    const isCurrentUser = member.id === user.id;
                    const canUpdateRole = isOwner && member.pivot.role !== 'owner';
                    const canRemove = (isOwner || isAdmin) &&
                        !isCurrentUser &&
                        member.pivot.role !== 'owner' &&
                        (isOwner || member.pivot.role !== 'admin');

                    return (
                        <div key={member.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                            <div className="flex justify-between items-center gap-4">
                                <div className="flex items-start gap-4 flex-1">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={member.photo_url} alt={member.name} />
                                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                    </Avatar>

                                    <div className="leading-tight">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold">{member.name}</h3>
                                            <Badge
                                                variant={
                                                    member.pivot.role === 'owner' ? 'default' :
                                                        member.pivot.role === 'admin' ? 'secondary' : 'outline'
                                                }
                                                className="rounded-md capitalize"
                                            >
                                                {member.pivot.role}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{member.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {canUpdateRole && (
                                        <Select
                                            value={member.pivot.role}
                                            onValueChange={(value) => handleRoleChange(member.id, value as 'member' | 'admin')}
                                        >
                                            <SelectTrigger className="w-[120px]">
                                                <SelectValue placeholder="Role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="member">Member</SelectItem>
                                                <SelectItem value="admin">Admin</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}

                                    {isCurrentUser ? (
                                        member.pivot.role !== 'owner' && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={handleLeaveTeam}
                                            >
                                                Leave Team
                                            </Button>
                                        )
                                    ) : (
                                        canRemove && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleRemoveMember(member.id)}
                                                className="text-destructive hover:bg-destructive/10"
                                            >
                                                Remove
                                            </Button>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </AuthenticatedLayout>
    )
}