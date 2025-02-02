import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/Components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";


export default function NotifictionDeleteDialog({
    showMultipleDeleteDialog,
    setShowMultipleDeleteDialog,
    selectedNotifications,
    handleDelete,
}: {
    showMultipleDeleteDialog: boolean;
    setShowMultipleDeleteDialog: (value: boolean) => void;
    selectedNotifications: number[];
    handleDelete: (ids: number | number[]) => void;
}) {
    return (
        <Dialog open={showMultipleDeleteDialog} onOpenChange={setShowMultipleDeleteDialog}>
            <DialogTrigger asChild>
                <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Selected ({selectedNotifications.length})
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Notifications</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete the selected notifications?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2">
                    <DialogClose asChild>
                        <Button variant="default">Cancel</Button>
                    </DialogClose>
                    <Button variant="destructive" onClick={() => handleDelete(selectedNotifications)}>
                        Yes, Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
