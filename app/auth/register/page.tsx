"use client";

import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { siteConfig } from "@/lib/config";
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
                onSuccess: (ctx) => {
                    setLoading(false);
                    router.push("/dashboard/links");
                    console.log("Registration success:", ctx.data);
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

                    <div className="my-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                        <hr className="border-" />
                        <span className="text-muted-foreground text-xs">Or continue with</span>
                        <hr className="border-" />
                    </div>

                    <div className="">
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
