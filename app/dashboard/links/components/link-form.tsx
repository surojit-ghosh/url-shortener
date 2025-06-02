"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { siteConfig } from "@/config/site";
import { Shuffle } from "lucide-react";
import { ILink, linkSchema } from "../schemas/link-schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useTransition } from "react";
import { getRandomKey } from "@/lib/helpers/link/get-random-key";

const LinkForm = () => {
    const [isPending, startTransition] = useTransition();
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<ILink>({
        resolver: zodResolver(linkSchema),
        defaultValues: {
            url: "",
            key: "",
        },
    });

    const onSubmit = (data: ILink) => {
        console.log("Form Data:", data);
        // handle create link here
    };

    useEffect(() => {
        startTransition(async () => {
            const initialKey = await getRandomKey();
            setValue("key", initialKey, { shouldValidate: true });
        });
    }, [setValue]);

    const handleGenerateKey = () => {
        startTransition(async () => {
            const newKey = await getRandomKey();
            setValue("key", newKey);
        });
    };

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
                        {errors.key && <p className="text-sm text-red-500">{errors.key.message}</p>}
                    </div>
                </div>
            </div>

            <div className="border-t pt-4">
                <Button type="submit" className="float-right">
                    Create Link
                </Button>
            </div>
        </form>
    );
};

export default LinkForm;
