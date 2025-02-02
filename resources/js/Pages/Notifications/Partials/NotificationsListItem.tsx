import { Button } from "@/components/ui/button";
import { Check, Trash2, MailCheck } from "lucide-react";
import { Notification } from "@/types";
import { cn } from "@/lib/utils";
import TeamInvitationNotification from "@/Components/TeamInvitationNotification";
import DefaultNotification from "@/Components/DefaultNotification";


export default function NotificationListItem({
    notification,
    isSelected,
    onToggle,
    onMarkAsRead,
    onDelete,
    showMarkAsRead,
}: {
    notification: Notification;
    isSelected: boolean;
    onToggle: (id: number) => void;
    onMarkAsRead: (id: number) => void;
    onDelete: (id: number) => void;
    showMarkAsRead: boolean;
}) {
    const isTeamInvitation = notification.data.type === 'team_invitation';

    return (
        <div className={cn(
            "flex items-start gap-4 w-full border rounded-lg p-4 transition-colors",
            "hover:bg-muted/50",
            isSelected && "bg-muted/50 border-primary"
        )}>
            {/* Checkbox */}
            <button
                onClick={() => onToggle(notification.id)}
                className="mt-1.5 flex items-center justify-center"
            >
                <div className={cn(
                    "h-4 w-4 rounded-sm border border-primary flex items-center justify-center",
                    isSelected ? "bg-primary text-primary-foreground" : "bg-background"
                )}>
                    {isSelected && <Check className="h-3 w-3" />}
                </div>
            </button>

            {/* Notification Content */}
            <div className="flex-1">
                {isTeamInvitation ? (
                    <TeamInvitationNotification notification={notification} />
                ) : <DefaultNotification notification={notification} />}
            </div>

            {/* Control Buttons */}
            <div className="flex flex-col items-center gap-2">
                {showMarkAsRead && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-2"
                        onClick={(e) => {
                            e.stopPropagation();
                            onMarkAsRead(notification.id);
                        }}
                    >
                        <MailCheck className="h-4 w-4" />
                    </Button>
                )}

                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-2 text-destructive hover:text-destructive"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(notification.id);
                    }}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}