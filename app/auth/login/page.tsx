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

                    <div className="my-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                        <hr className="border-" />
                        <span className="text-muted-foreground text-xs">Or continue With</span>
                        <hr className="border-" />
                    </div>

                    <div>
                        <Button type="button" variant="outline" className="w-full">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="0.98em"
                                height="1em"
                                viewBox="0 0 256 262"
                            >
                                <path
                                    fill="#4285f4"
                                    d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                                ></path>
                                <path
                                    fill="#34a853"
                                    d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                                ></path>
                                <path
                                    fill="#fbbc05"
                                    d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
                                ></path>
                                <path
                                    fill="#eb4335"
                                    d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                                ></path>
                            </svg>
                            <span>Google</span>
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
