import { Checkbox } from "@/Components/ui/checkbox";
import { Button } from "@/components/ui/button";
import NotificationListItem from "./NotificationsListItem";
import { Notification } from "@/types";

export default   function NotificationList({
    notifications,
    selectedNotifications,
    toggleSelection,
    handleMarkAsRead,
    handleDelete,
    handleMarkAllAsRead,
    selectAll,
    currentTab,
}: {
    notifications: Notification[];
    selectedNotifications: number[];
    toggleSelection: (id: number) => void;
    handleMarkAsRead: (id: number) => void;
    handleDelete: (id: number) => void;
    handleMarkAllAsRead: () => void;
    selectAll: () => void;
    currentTab: string;
}) {
    return (
        <div className="space-y-4">
            {notifications.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                    No {currentTab === 'unread-notifications' ? 'unread' : 'read'} notifications
                </p>
            ) : (
                <>
                    <div className="flex items-center justify-between pb-2">
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="select-all"
                                checked={selectedNotifications.length === notifications.length}
                                onCheckedChange={selectAll}
                            />
                            <label htmlFor="select-all" className="text-sm text-muted-foreground">
                                Select all
                            </label>
                        </div>
                        {currentTab === 'unread-notifications' && (
                            <Button variant="outline" onClick={handleMarkAllAsRead}>
                                Mark all as read
                            </Button>
                        )}
                    </div>
                    <div className="space-y-4">
                        {notifications.map(notification => (
                            <NotificationListItem
                                key={notification.id}
                                notification={notification}
                                isSelected={selectedNotifications.includes(notification.id)}
                                onToggle={() => toggleSelection(notification.id)}
                                onMarkAsRead={() => handleMarkAsRead(notification.id)}
                                onDelete={() => handleDelete(notification.id)}
                                showMarkAsRead={currentTab === 'unread-notifications'}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}