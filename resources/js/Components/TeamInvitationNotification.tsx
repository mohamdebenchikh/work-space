import { Button } from "@/components/ui/button";
import { router } from "@inertiajs/react";
import { Clock } from "lucide-react";
import { Notification } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";


export default function TeamInvitationNotification({
    notification,
}: {
    notification: Notification;
}) {
    const { toast } = useToast();
    const [accepting, setAccepting] = useState(false);
    const [rejecting, setRejecting] = useState(false);

    const handleAction = async (url: string, actionType: 'accept' | 'reject') => {
        try {
            actionType === 'accept' ? setAccepting(true) : setRejecting(true);

            await router.visit(url, {
                onSuccess: () => {
                    toast({
                        title: 'Success',
                        description: `Invitation ${actionType}ed successfully`,
                    });
                },
                onError: () => {
                    toast({
                        variant: 'destructive',
                        title: 'Error',
                        description: `Failed to ${actionType} invitation`,
                    });
                }
            });
        } finally {
            actionType === 'accept' ? setAccepting(false) : setRejecting(false);
        }
    };

    if (!notification.data.accept_url || !notification.data.reject_url) {
        return null;
    }

    return (
        <div className="flex flex-col items-start w-full">
            <div className="flex w-full items-center justify-between">
                <strong className="text-primary mb-1">
                    {notification.data.title}
                </strong>
                <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(notification.created_at))} ago
                    </span>
                </div>
            </div>
            <p className="text-sm text-muted-foreground font-medium line-clamp-2">
                {notification.data.message}
            </p>
            <div className="flex items-center mt-2 gap-2">
                <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleAction(notification.data.accept_url, 'accept')}
                    disabled={accepting || rejecting}
                >
                    {accepting ? 'Processing...' : 'Accept Invitation'}
                </Button>
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleAction(notification.data.reject_url, 'reject')}
                    disabled={accepting || rejecting}
                >
                    {rejecting ? 'Processing...' : 'Reject Invitation'}
                </Button>
            </div>
        </div>
    );
}