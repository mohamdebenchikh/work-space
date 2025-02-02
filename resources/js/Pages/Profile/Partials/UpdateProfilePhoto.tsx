import React, { useState, useRef, ChangeEvent } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/Components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/Components/ui/dialog';
import { router } from '@inertiajs/react';
import { User } from '@/types';
import InputError from '@/Components/InputError';
import { useToast } from '@/hooks/use-toast';

export default function UpdateProfilePhoto({ user }: { user: User }) {
    const [photo, setPhoto] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { toast } = useToast();

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);

            const reader = new FileReader();
            reader.onload = () => {
                if (reader.result) {
                    setPhoto(reader.result as string);
                    setIsDialogOpen(true); // Open the confirmation dialog
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleConfirmUpload = () => {

        if (selectedFile) {
            setProcessing(true);
            const formData = new FormData();
            formData.append('profile_photo', selectedFile);
            router.post(route('profile.photo.update'), formData, {
                forceFormData: true,
                onSuccess: () => {
                    setIsDialogOpen(false);
                    setPhoto(null);
                    setSelectedFile(null)
                    toast({
                        title: 'Profile Photo Updated',
                        description: 'Your profile photo has been updated successfully.',
                    })

                },
                onError: (errors) => {
                    setError(errors.profile_photo);
                },
                onFinish: () => {
                    setProcessing(false);
                }
            });
        }
    };

    return (
        <>
            <div className="flex items-center gap-4">
                <Avatar className='size-12'>
                    <AvatarImage src={user.photo_url} className="object-cover" alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>

                <Button variant="outline" onClick={handleButtonClick}>
                    Change Photo
                </Button>

                {/* Hidden file input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                />
            </div>

            {/* Confirmation Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Profile Photo</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to upload this image as your profile photo?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col justify-center items-center my-4 space-y-2">
                        {error && <InputError message={error} />}
                        <Avatar className='size-48'>
                            <AvatarImage src={photo ?? ""} className="object-cover" alt="Selected Photo" />
                            <AvatarFallback>SC</AvatarFallback>
                        </Avatar>
                    </div>
                    <DialogFooter className='gap-2'>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="default" onClick={handleConfirmUpload} disabled={processing}>
                            {processing ? "Uploading..." : "Confirm"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
