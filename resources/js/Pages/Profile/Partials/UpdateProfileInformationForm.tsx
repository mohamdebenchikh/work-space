import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/Components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from '@/Components/ui/textarea';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, router, usePage } from "@inertiajs/react";
import UpdateProfilePhoto from "./UpdateProfilePhoto";
import { Label } from "@/Components/ui/label";

const formSchema = z.object({
    name: z.string().min(3, { message: "Name must be at least 3 characters." }),
    email: z.string().email({ message: "Invalid email address." }),
    bio: z.string().optional(),
});

export default function UpdateProfileInformation({ mustVerifyEmail, status }: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const user = usePage().props.auth.user;

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: user.name,
            email: user.email,
            bio: user.bio ?? "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {

        router.patch(route("profile.update"), values, {
            onError: (errors) => {
                Object.keys(errors).forEach((field) => {
                    form.setError(field as "name" | "email" | "bio", {
                        type: "server",
                        message: errors[field][0],
                    });
                });
            }
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your account's profile information and email address.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-6 space-y-2">
                    <Label>Profile Photo</Label>
                    <UpdateProfilePhoto user={user} />
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bio</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {mustVerifyEmail && user.email_verified_at === null && (
                            <div>
                                <p className="mt-2 text-sm text-gray-800">
                                    Your email address is unverified.
                                    <Link
                                        href={route("verification.send")}
                                        method="post"
                                        as="button"
                                        className="rounded-md text-sm text-muted-foreground underline  focus:outline-none"
                                    >
                                        Click here to re-send the verification email.
                                    </Link>
                                </p>
                                {status === "verification-link-sent" && (
                                    <div className="mt-2 text-sm font-medium text-green-600">
                                        A new verification link has been sent to your email address.
                                    </div>
                                )}
                            </div>
                        )}
                        <div className="flex items-center gap-4">
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                Save
                            </Button>
                            {form.formState.isSubmitSuccessful && (
                                <p className="text-sm text-muted-foreground">Saved.</p>
                            )}
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}

