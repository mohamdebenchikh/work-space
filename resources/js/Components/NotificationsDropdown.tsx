import { useState } from "react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel } from "./ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Bell, Clock, MailCheck } from "lucide-react";
import { PageProps } from "@/types";
import { usePage, router } from "@inertiajs/react";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import TeamInvitationNotification from "./TeamInvitationNotification";

export default function NotificationsDropdown() {
  const { toast } = useToast();
  const { unreadNotifications } = usePage<PageProps>().props.auth;
  const [markingAllAsRead, setMarkingAllAsRead] = useState(false);

  const markAsRead = (notificationId: number): void => {
    router.post(route('notifications.mark-as-read', notificationId), {}, {
      onSuccess: () => {
        toast({
          title: 'Success',
          description: 'Notification has been marked as read',
        });
      },
      onError: () => {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to mark notification as read',
        });
      },
    });
  };

  const markAllAsRead = () => {
    setMarkingAllAsRead(true);
    router.patch(route('notifications.mark-all-as-read'), {}, {
      onSuccess: () => {
        setMarkingAllAsRead(false);
        toast({
          title: 'Success',
          description: "All notifications have been marked as read",
        });
      },
      onError: () => {
        setMarkingAllAsRead(false);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to mark all notifications as read',
        });
      }
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadNotifications.length > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
              {unreadNotifications.length}
            </span>
          )}
          <span className="sr-only">Toggle notifications</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-[350px]" align="end">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadNotifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                markAllAsRead();
              }}
              className="h-auto px-2 py-1 text-xs"
              disabled={markingAllAsRead}
            >
              {markingAllAsRead ? 'Marking...' : 'Mark all as read'}
            </Button>
          )}
        </DropdownMenuLabel>

        <div className="max-h-[400px] overflow-y-auto">
          {unreadNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-4 text-center">
              <MailCheck className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                No notifications available
              </p>
            </div>
          ) : (
            unreadNotifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="px-4 py-2 cursor-pointer"
              >
                {notification.data.type === 'team_invitation' ? (
                  <TeamInvitationNotification
                    notification={notification}
                  />
                ) : (
                  <div className="flex flex-col items-start w-full">
                    <div className="flex w-full items-center justify-between">
                      <strong className="text-primary mb-1">{notification.data.title}</strong>
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
                  </div>
                )}
              </DropdownMenuItem>
            ))
          )}
        </div>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex items-center justify-center"
          onSelect={() => router.visit(route('notifications.index'))}
        >
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}