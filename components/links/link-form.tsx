"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { siteConfig } from "@/config/site";
import { Shuffle } from "lucide-react";
import { LinkData, linkSchema } from "@/lib/zod/link.schema";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useTransition } from "react";
import { checkIfKeyExists, genereateRandomKey, getDefaultValues } from "@/actions/link.action";
import { useDebounceValue } from "usehooks-ts";
import { toast } from "sonner";

const LinkForm = ({ close }: { close: () => void }) => {
    const [isPending, startTransition] = useTransition();
    const {
        register,
        handleSubmit,
        setValue,
        setError,
        control,
        clearErrors,
        trigger,
        reset,
        formState: { errors, isSubmitting, isValid },
    } = useForm<LinkData>({
        resolver: zodResolver(linkSchema),
        defaultValues: async () => await getDefaultValues(),
    });
    const keyInput = useWatch({ control, name: "key" });
    const [debouncedKey, setDebouncedKey] = useDebounceValue(keyInput, 500);

    const onSubmit = async (formData: LinkData) => {
        const res = await fetch("/api/link", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...formData }),
        });

        const result = await res.json();

        if (!res.ok) {
            if (result?.fieldErrors) {
                const fieldErrors = result.fieldErrors as Partial<Record<keyof LinkData, string[]>>;
                Object.entries(fieldErrors).forEach(([field, messages]) => {
                    setError(field as keyof LinkData, {
                        type: "manual",
                        message: messages?.[0],
                    });
                });
            }
            return;
        }

        reset();

        toast.success("Link created successfully!");
        close();
        setDebouncedKey("");
    };

    const handleGenerateKey = () => {
        startTransition(async () => {
            const newKey = await genereateRandomKey();
            setValue("key", newKey, { shouldValidate: true });
            setDebouncedKey(newKey);
        });
    };

    useEffect(() => {
        const validateKey = async () => {
            if (!debouncedKey) return;

            const isExists = await checkIfKeyExists(debouncedKey);

            if (isExists) {
                setError("key", {
                    type: "manual",
                    message: "This slug is already taken.",
                });
            } else {
                clearErrors("key");
                trigger("key");
            }
        };

        validateKey();
    }, [debouncedKey, setError, clearErrors, trigger]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="destination">Destination URL</Label>
                <Input
                    {...register("url")}
                    id="url"
                    type="url"
                    placeholder="https://example.com/your-long-url"
                />
                {errors.url && <p className="text-sm text-red-500">{errors.url.message}</p>}
            </div>

            <div className="space-y-2">
                <div className="flex items-center">
                    <Label className="flex-1">Short Link</Label>
                    <Button
                        disabled={isPending}
                        onClick={handleGenerateKey}
                        variant="outline"
                        size={"icon"}
                        className="h-[26px]"
                    >
                        <Shuffle size={16} />
                    </Button>
                </div>
                <div className="flex gap-2">
                    <div className="bg-muted border-input flex items-center rounded-md border px-3 py-1 text-sm">
                        {siteConfig.url}
                    </div>
                    <div className="relative flex-1">
                        <Input id="key" placeholder="custom-key (optional)" {...register("key")} />
                    </div>
                </div>
                {errors.key && <p className="text-sm text-red-500">{errors.key.message}</p>}
            </div>

            <div className="border-t pt-4">
                <Button type="submit" disabled={isSubmitting || !isValid} className="float-right">
                    Create Link
                </Button>
            </div>
        </form>
    );
};

export default LinkForm;
