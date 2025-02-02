import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { useState } from "react";
import { Notification } from "@/types";
import { useToast } from "@/hooks/use-toast";
import NotifictionDeleteDialog from "./Partials/NotificationDeleteDialog";
import NotificationList from "./Partials/NotificationsList";


export default function Notifications({
    unreadNotifications,
    readNotifications,
}: {
    unreadNotifications: Notification[];
    readNotifications: Notification[];
}) {
    const { toast } = useToast();
    const [showMultipleDeleteDialog, setShowMultipleDeleteDialog] = useState(false);
    const [selectedNotifications, setSelectedNotifications] = useState<number[]>([]);
    const [currentTab, setCurrentTab] = useState("unread-notifications");

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.read_at) {
            handleMarkAsRead(notification.id);
        }
        if (notification.data.action_url) {
            router.visit(notification.data.action_url);
        }
    };

    const handleMarkAsRead = (id: number) => {
        router.patch(route('notifications.mark-as-read', id), {}, {
            onSuccess: () => {
                toast({ title: "Success", description: "Notification marked as read" });
            }
        });
    };

    const handleDelete = (ids: number | number[]) => {
        if (Array.isArray(ids)) {
            router.delete(route('notifications.destroy-all', { ids }), {
                onSuccess: () => {
                    setSelectedNotifications([]);
                    toast({ title: "Success", description: "Notifications deleted successfully" });
                }
            });
        } else {
            router.delete(route('notifications.destroy', ids), {
                onSuccess: () => {
                    setSelectedNotifications((prev) => prev.filter((id) => id !== ids));
                    toast({ title: "Success", description: "Notification deleted successfully" });
                }
            });
        }
    };

    const handleMarkAllAsRead = () => {
        router.patch(route('notifications.mark-all-as-read'), {}, {
            onSuccess: () => {
                toast({ title: "Success", description: "All notifications marked as read" });
            }
        });
    };

    const toggleSelection = (id: number) => {
        setSelectedNotifications(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    };

    const selectAll = () => {
        const allIds = currentTab === 'unread-notifications'
            ? unreadNotifications.map(n => n.id)
            : readNotifications.map(n => n.id);

        setSelectedNotifications(prev =>
            prev.length === allIds.length ? [] : allIds
        );
    };

    return (
        <AuthenticatedLayout header="Notifications">
            <Head title="Notifications" />
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle>Notifications</CardTitle>
                            <CardDescription>Manage your notifications</CardDescription>
                        </div>
                        {selectedNotifications.length > 0 && (
                            <NotifictionDeleteDialog
                                showMultipleDeleteDialog={showMultipleDeleteDialog}
                                setShowMultipleDeleteDialog={setShowMultipleDeleteDialog}
                                selectedNotifications={selectedNotifications}
                                handleDelete={handleDelete}
                            />
                        )}
                    </div>
                </CardHeader>

                <Tabs value={currentTab} onValueChange={(value) => {
                    setCurrentTab(value);
                    setSelectedNotifications([]);
                }}>
                    <div className="p-4">
                        <TabsList>
                            <TabsTrigger value="unread-notifications">
                                Unread ({unreadNotifications.length})
                            </TabsTrigger>
                            <TabsTrigger value="read-notifications">
                                Read ({readNotifications.length})
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <CardContent>
                        <TabsContent value="unread-notifications">
                            <NotificationList
                                notifications={unreadNotifications}
                                selectedNotifications={selectedNotifications}
                                toggleSelection={toggleSelection}
                                handleMarkAsRead={handleMarkAsRead}
                                handleDelete={handleDelete}
                                handleMarkAllAsRead={handleMarkAllAsRead}
                                selectAll={selectAll}
                                currentTab={currentTab}
                            />
                        </TabsContent>

                        <TabsContent value="read-notifications">
                            <NotificationList
                                notifications={readNotifications}
                                selectedNotifications={selectedNotifications}
                                toggleSelection={toggleSelection}
                                handleDelete={handleDelete}
                                handleMarkAsRead={handleMarkAsRead}
                                handleMarkAllAsRead={handleMarkAllAsRead}
                                selectAll={selectAll}
                                currentTab={currentTab}
                            />
                        </TabsContent>
                    </CardContent>
                </Tabs>
            </Card>
        </AuthenticatedLayout>
    )
}


