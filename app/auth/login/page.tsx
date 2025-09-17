"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { siteConfig } from "@/config/site";
import Link from "next/link";
import { useState } from "react";
import { signIn } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (formData: LoginFormData) => {
        const { email, password } = formData;

        await signIn.email(
            {
                email,
                password,
            },
            {
                onRequest: () => {
                    setLoading(true);
                },
                onResponse: () => {},
                onError: (ctx) => {
                    setLoading(false);
                    console.error("Login error:", ctx.error);
                    toast.error(ctx.error.message);
                },
                onSuccess: () => {
                    router.push("/dashboard/links");
                    setLoading(false);
                    toast.success("Logged in successfully!");
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
                            Sign In to {siteConfig.name}
                        </h1>
                        <p className="text-sm">Welcome back! Sign in to continue</p>
                    </div>

                    <div className="mt-6 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="block text-sm">
                                Email
                            </Label>
                            <Input
                                type="email"
                                id="email"
                                placeholder="Email"
                                {...register("email")}
                            />
                            {errors.email && (
                                <p className="text-xs text-red-500">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-0.5">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-sm">
                                    Password
                                </Label>
                                <Button asChild variant="link" size="sm">
                                    <Link href="#" className="text-sm">
                                        Forgot your Password?
                                    </Link>
                                </Button>
                            </div>
                            <Input
                                type="password"
                                id="password"
                                placeholder="Password"
                                {...register("password")}
                            />
                            {errors.password && (
                                <p className="text-xs text-red-500">{errors.password.message}</p>
                            )}
                        </div>

                        <Button disabled={loading} type="submit" className="w-full">
                            {loading ? "Creating..." : "Login"}
                        </Button>
                    </div>
                </div>

                <div className="p-3">
                    <p className="text-center text-sm">
                        Don&apos;t have an account ?
                        <Button asChild variant="link" className="px-2">
                            <Link href="/auth/register">Create account</Link>
                        </Button>
                    </p>
                </div>
            </form>
        </section>
    );
}
