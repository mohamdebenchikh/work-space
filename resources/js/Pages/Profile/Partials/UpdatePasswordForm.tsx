import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/Components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { useRef } from "react";
import { router } from "@inertiajs/react";

const formSchema = z
    .object({
        current_password: z.string().min(1, { message: "Current password is required." }),
        password: z.string().min(8, { message: "Password must be at least 8 characters." }),
        password_confirmation: z.string().min(1, { message: "Password confirmation is required." }),
    })
    .superRefine(({ password, password_confirmation }, ctx) => {
        if (password !== password_confirmation) {
            ctx.addIssue({
                path: ["password_confirmation"],
                message: "Passwords do not match.",
                code: "custom"
            });
        }
    });

export default function UpdatePasswordForm() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            current_password: "",
            password: "",
            password_confirmation: "",
        },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        router.put(route("password.update"), values, {
            preserveScroll: true,
            onSuccess: () => form.reset(),
            onError: (errors) => {
                if (errors.current_password) {
                    form.setValue("current_password", "");
                    currentPasswordInput.current?.focus();
                }

                if (errors.password) {
                    form.setValue("password", "");
                    form.setValue("password_confirmation", "");
                    passwordInput.current?.focus();
                }
            },
        });

    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Update Password</CardTitle>
                <CardDescription>
                    Ensure your account is using a long, random password to stay secure.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="max-w-xl">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="current_password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Current Password</FormLabel>
                                        <FormControl>
                                            <Input {...field} ref={currentPasswordInput} type="password" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>New Password</FormLabel>
                                        <FormControl>
                                            <Input {...field} ref={passwordInput} type="password" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password_confirmation"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm Password</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="password" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

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
                </div>
            </CardContent>
        </Card>
    );
}
