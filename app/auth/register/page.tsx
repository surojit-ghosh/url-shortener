"use client";

import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { siteConfig } from "@/config/site";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { signUp } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const registerSchema = z
    .object({
        firstname: z.string().min(1, "First name is required"),
        lastname: z.string().min(1, "Last name is required"),
        email: z.string().email("Invalid email"),
        password: z.string().min(8, "Password must be at least 8 characters"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (formData: RegisterFormData) => {
        const { firstname, lastname, email, password } = formData;

        await signUp.email(
            {
                email,
                password,
                name: `${firstname} ${lastname}`,
            },
            {
                onRequest: () => {
                    setLoading(true);
                },
                onResponse: () => {},
                onError: (ctx) => {
                    setLoading(false);
                    console.error("Registration error:", ctx.error);
                    toast.error(ctx.error.message);
                },
                onSuccess: () => {
                    setLoading(false);
                    router.push("/dashboard/links");
                    toast.success("Account created successfully! Check your email to verify.");
                },
            }
        );
    };

    return (
        <section className="flex min-h-screen px-4 py-10">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="m-auto h-fit w-full max-w-sm overflow-hidden border shadow-md"
            >
                <div className="bg-card p-8">
                    <div className="text-center">
                        <Link href="/" aria-label="go home" className="mx-auto block w-fit">
                            <Logo />
                        </Link>
                        <h1 className="mt-4 mb-1 text-xl font-semibold">
                            Create a {siteConfig.name} Account
                        </h1>
                        <p className="text-sm">Welcome! Create an account to get started</p>
                    </div>

                    <div className="mt-6 space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label htmlFor="firstname" className="block text-sm">
                                    Firstname
                                </Label>
                                <Input
                                    id="firstname"
                                    {...register("firstname")}
                                    placeholder="First Name"
                                />
                                {errors.firstname && (
                                    <p className="text-xs text-red-500">
                                        {errors.firstname.message}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastname" className="block text-sm">
                                    Lastname
                                </Label>
                                <Input
                                    id="lastname"
                                    {...register("lastname")}
                                    placeholder="Last Name"
                                />
                                {errors.lastname && (
                                    <p className="text-xs text-red-500">
                                        {errors.lastname.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="block text-sm">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                {...register("email")}
                                placeholder="Email"
                            />
                            {errors.email && (
                                <p className="text-xs text-red-500">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm">
                                Password
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                {...register("password")}
                                placeholder="Password"
                            />
                            {errors.password && (
                                <p className="text-xs text-red-500">{errors.password.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-sm">
                                Confirm Password
                            </Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                {...register("confirmPassword")}
                                placeholder="Confirm Password"
                            />
                            {errors.confirmPassword && (
                                <p className="text-xs text-red-500">
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Creating..." : "Register"}
                        </Button>
                    </div>
                </div>

                <div className="bg-muted/15 p-3">
                    <p className="text-center text-sm">
                        Have an account?
                        <Button asChild variant="link" className="px-2">
                            <Link href="/auth/login">Sign In</Link>
                        </Button>
                    </p>
                </div>
            </form>
        </section>
    );
}
