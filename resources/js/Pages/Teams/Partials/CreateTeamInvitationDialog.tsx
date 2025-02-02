import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/Components/ui/dialog"
import { UserPlusIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { useForm } from "@inertiajs/react";
import { Label } from "@/Components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/Components/ui/select";
import InputError from "@/Components/InputError";
import React from "react";
import { Button } from "@/components/ui/button";
import { Team } from "@/types";


export default function CreateTeamInvitationDialog({ team }: { team: Team }) {

    const { toast } = useToast();
    const [showInviteDialog, setShowInviteDialog] = React.useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        message: '',
        role: 'member',
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('team.invitations.store', team.id), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                toast({
                    title: 'User Invited',
                    description: 'The user has been invited to the team.',
                });
                reset();
                setShowInviteDialog(false);
            }
        });
    }


    return (
        <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
            <DialogTrigger asChild>
                <Button>
                    <UserPlusIcon className="w-5 h-5" />
                    Invite New Member
                </Button>
            </DialogTrigger>
            <DialogContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Invite New Member</DialogTitle>
                        <DialogDescription>
                            Enter the email of the user you want to invite to your team.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input type="email" name="email" placeholder="Enter email"
                                onChange={(e) => setData('email', e.target.value)} id="email" />
                            <InputError message={errors.email} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Select name="role" onValueChange={(value) => setData('role', value)} defaultValue={data.role} >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="member">Member</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.role} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="message">Message (optional)</Label>
                            <Textarea name="message" onChange={(e) => setData('message', e.target.value)} id="message" />
                            <InputError message={errors.message} />
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button variant="outline" type="reset">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">{processing ? 'Inviting...' : 'Invite'}</Button>
                    </DialogFooter>
                </form>

            </DialogContent>
        </Dialog>
    )
} 