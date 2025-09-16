import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { siteConfig } from "@/config/site";
import { Shuffle } from "lucide-react";
import { ILinkForm, linkFormSchema } from "@/lib/zod/link.schema";
import { useForm, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useTransition, useState } from "react";
import { checkIfKeyExists, genereateRandomKey, getDefaultValues } from "@/lib/actions/link.action";
import { useCreateLink } from "@/lib/queries/links";
import { useDebounceValue } from "usehooks-ts";
import { toast } from "sonner";

const LinkForm = ({ close }: { close: () => void }) => {
    const [isPending, startTransition] = useTransition();
    const [defaultValues, setDefaultValues] = useState<ILinkForm | undefined>(undefined);

    // TanStack Query mutation for creating links
    const createLinkMutation = useCreateLink();

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
    } = useForm<ILinkForm>({
        resolver: zodResolver(linkFormSchema),
        defaultValues,
        mode: "onChange",
        reValidateMode: "onChange",
    });
    const keyInput = useWatch({ control, name: "key" });
    const [debouncedKey, setDebouncedKey] = useDebounceValue(keyInput, 500);

    // Load default values when component mounts
    useEffect(() => {
        const loadDefaultValues = async () => {
            try {
                const defaultVals = await getDefaultValues();
                setDefaultValues(defaultVals);
                reset(defaultVals);
            } catch (error) {
                console.error("Failed to load default values:", error);
                // Fallback to empty defaults if the function fails
                const fallbackDefaults: ILinkForm = { url: "", key: "" };
                setDefaultValues(fallbackDefaults);
                reset(fallbackDefaults);
            }
        };

        loadDefaultValues();
    }, [reset, setDefaultValues]);

    const onSubmit = async (formData: ILinkForm) => {
        try {
            await createLinkMutation.mutateAsync(formData);

            // Reset form and close modal
            reset();
            toast.success("Link created successfully!");
            close();
            setDebouncedKey("");
        } catch (error: unknown) {
            // Handle validation errors from the server
            const axiosError = error as {
                response?: {
                    data?: {
                        fieldErrors?: Partial<Record<keyof ILinkForm, string[]>>;
                        message?: string;
                    };
                };
            };

            if (axiosError?.response?.data?.fieldErrors) {
                const fieldErrors = axiosError.response.data.fieldErrors;
                Object.entries(fieldErrors).forEach(([field, messages]) => {
                    if (messages && messages.length > 0) {
                        setError(field as keyof ILinkForm, {
                            type: "manual",
                            message: messages[0],
                        });
                    }
                });
            } else {
                // Generic error handling
                toast.error(
                    axiosError?.response?.data?.message ||
                        "Failed to create link. Please try again."
                );
            }
        }
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

            <div className="space-y-2">
                <Label htmlFor="expiresAt">Expiration Date & Time (Optional)</Label>
                <Controller
                    name="expiresAt"
                    control={control}
                    render={({ field }) => (
                        <DateTimePicker
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Select expiration date and time"
                            disabled={isSubmitting}
                        />
                    )}
                />
                {errors.expiresAt && (
                    <p className="text-sm text-red-500">{errors.expiresAt.message}</p>
                )}
            </div>

            <div className="border-t pt-4">
                <Button
                    type="submit"
                    disabled={isSubmitting || !isValid || createLinkMutation.isPending}
                    className="float-right"
                >
                    {createLinkMutation.isPending ? "Creating..." : "Create Link"}
                </Button>
            </div>
        </form>
    );
};

export default LinkForm;
