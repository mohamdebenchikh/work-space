import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";


const DeleteDialog = ({
    open,
    onOpenChange,
    onConfirm,
    isDeleting
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    isDeleting: boolean;
}) => (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Delete Project</DialogTitle>
                <DialogDescription>
                    This action cannot be undone. All project data will be permanently removed.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2">
                <DialogClose asChild>
                    <Button variant="outline" disabled={isDeleting}>
                        Cancel
                    </Button>
                </DialogClose>
                <Button
                    onClick={onConfirm}
                    variant="destructive"
                    disabled={isDeleting}
                >
                    {isDeleting ? 'Deleting...' : 'Delete Project'}
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
);

export default DeleteDialog;