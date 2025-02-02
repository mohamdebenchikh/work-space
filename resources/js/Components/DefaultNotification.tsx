import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";
import { Clock } from "lucide-react";
import { Notification } from "@/types";
import { formatDistanceToNow } from "date-fns";


export default function NotificationItem({ notification }: {
    notification: Notification
}) {

    return (
        <div className="flex flex-col items-start w-full group">
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

            {notification.data.action_url && (
                <div className="mt-2 w-full">
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full"

                    >
                        <Link href={notification.data.action_url}>View Details</Link>
                    </Button>
                </div>
            )}
        </div>
    );
}