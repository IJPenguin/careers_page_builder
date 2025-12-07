"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const registerSchema = z
    .object({
        companyName: z
            .string()
            .min(2, "Company name must be at least 2 characters"),
        companySlug: z
            .string()
            .min(2, "Slug must be at least 2 characters")
            .max(50, "Slug must be less than 50 characters")
            .regex(
                /^[a-z0-9-]+$/,
                "Slug can only contain lowercase letters, numbers, and hyphens"
            ),
        email: z.string().email("Please enter a valid email address"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
    const router = useRouter();
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const companyName = watch("companyName");

    // Auto-generate slug from company name
    const handleCompanyNameChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = e.target.value;
        const slug = value
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .slice(0, 50);

        // Update the slug field value
        const slugInput = document.getElementById(
            "companySlug"
        ) as HTMLInputElement;
        if (slugInput) {
            slugInput.value = slug;
        }
    };

    const onSubmit = async (data: RegisterFormData) => {
        setIsLoading(true);
        setError("");

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    companyName: data.companyName,
                    companySlug: data.companySlug,
                    email: data.email,
                    password: data.password,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Registration failed");
            }

            // Show success toast
            toast.success("Account created successfully!", {
                description: "Setting up your careers page...",
            });

            // Redirect to edit page on success
            router.push(`/${result.company.slug}/edit`);
            router.refresh();
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "An error occurred during registration";
            setError(errorMessage);
            toast.error("Registration failed", {
                description: errorMessage,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Create Your Account</CardTitle>
                <CardDescription>
                    Register your company and start building your careers page
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {error && (
                        <div className="rounded-md bg-red-50 p-4 text-sm text-red-800 border border-red-200">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="companyName">Company Name</Label>
                        <Input
                            id="companyName"
                            type="text"
                            placeholder="ACME Corporation"
                            {...register("companyName")}
                            onChange={(e) => {
                                register("companyName").onChange(e);
                                handleCompanyNameChange(e);
                            }}
                            disabled={isLoading}
                        />
                        {errors.companyName && (
                            <p className="text-sm text-red-600">
                                {errors.companyName.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="companySlug">Company Slug</Label>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">
                                yoursite.com/
                            </span>
                            <Input
                                id="companySlug"
                                type="text"
                                placeholder="acme"
                                {...register("companySlug")}
                                disabled={isLoading}
                                className="flex-1"
                            />
                        </div>
                        <p className="text-xs text-gray-500">
                            This will be your unique URL. Only lowercase
                            letters, numbers, and hyphens.
                        </p>
                        {errors.companySlug && (
                            <p className="text-sm text-red-600">
                                {errors.companySlug.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="you@company.com"
                            {...register("email")}
                            disabled={isLoading}
                            autoComplete="email"
                        />
                        {errors.email && (
                            <p className="text-sm text-red-600">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            {...register("password")}
                            disabled={isLoading}
                            autoComplete="new-password"
                        />
                        {errors.password && (
                            <p className="text-sm text-red-600">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">
                            Confirm Password
                        </Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            {...register("confirmPassword")}
                            disabled={isLoading}
                            autoComplete="new-password"
                        />
                        {errors.confirmPassword && (
                            <p className="text-sm text-red-600">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <LoadingSpinner
                                    size="sm"
                                    className="border-white border-t-transparent"
                                />
                                Creating account...
                            </span>
                        ) : (
                            "Create Account"
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
