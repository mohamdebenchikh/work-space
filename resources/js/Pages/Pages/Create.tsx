import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import InputError from "@/Components/InputError";
import { TextEditor } from "@/Components/TextEditor";
import { useState } from "react";

export default function CreatePage() {
    const { data, setData, post, reset, processing, errors } = useForm({
        title: '',
        description: '',
        status: 'draft',
        content: '',
        image: null as File | null,
    });

    const [preview, setPreview] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('pages.store'), {
            forceFormData: true,
        });
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    return (
        <AuthenticatedLayout header="Create Page">
            <Head title="Create Page" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Main Content Card */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Page Content</CardTitle>
                        <CardDescription>Main content of your page</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        required
                                        placeholder="Enter page title"
                                    />
                                    <InputError message={errors.title} />
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="content">Content</Label>
                                    <TextEditor
                                        content={data.content}
                                        onChange={(value) => setData('content', value)}
                                    />
                                    <InputError message={errors.content} />
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Settings Sidebar */}
                <div className="space-y-4">
                    {/* Cover Image Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Cover Image</CardTitle>
                            <CardDescription>Add a featured image for your page</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="image">Upload Image</Label>
                                    <Input 
                                        id="image" 
                                        type="file" 
                                        onChange={handleImageUpload}
                                        accept="image/*"
                                        className="cursor-pointer"
                                    />
                                    <InputError message={errors.image} />
                                    {preview && (
                                        <div className="mt-4 space-y-1">
                                            <img 
                                                src={preview} 
                                                alt="Preview" 
                                                className="rounded-lg object-cover w-full h-48"
                                            />
                                            <Button className="w-full" variant={'destructive'} size={'sm'} onClick={() => {
                                                setPreview(null);
                                                setData('image', null);
                                            }}>Remove</Button>
                                        </div>
                                    )}
                                    <p className="text-sm text-muted-foreground">
                                        Recommended size: 1200x630 pixels (2:1 ratio)
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Settings Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Settings</CardTitle>
                            <CardDescription>Page configuration options</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Enter page description"
                                    />
                                    <InputError message={errors.description} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select
                                        onValueChange={(value) => setData('status', value)}
                                        value={data.status}
                                    >
                                        <SelectTrigger id="status" name="status">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="draft">Draft</SelectItem>
                                            <SelectItem value="published">Published</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.status} />
                                </div>

                                <Button 
                                    type="submit" 
                                    disabled={processing}
                                    className="w-full"
                                >
                                    Create Page
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}