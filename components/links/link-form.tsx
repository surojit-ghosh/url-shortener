import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { siteConfig } from "@/config/site";
import { Shuffle, Lock, LockOpen, Eye, EyeOff } from "lucide-react";
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
    const [isPasswordProtected, setIsPasswordProtected] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

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
    const passwordInput = useWatch({ control, name: "password" });
    const [debouncedKey, setDebouncedKey] = useDebounceValue(keyInput, 500);

    // Update password protection state when password field changes
    useEffect(() => {
        setIsPasswordProtected(Boolean(passwordInput && passwordInput.length > 0));
    }, [passwordInput]);

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
            const apiError = error as {
                message?: string;
                fieldErrors?: Partial<Record<keyof ILinkForm, string[]>>;
                status?: number;
            };

            if (apiError.fieldErrors) {
                Object.entries(apiError.fieldErrors).forEach(([field, messages]) => {
                    if (messages && messages.length > 0) {
                        setError(field as keyof ILinkForm, {
                            type: "manual",
                            message: messages[0],
                        });
                    }
                });
            } else {
                // Generic error handling
                toast.error(apiError.message || "Failed to create link. Please try again.");
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

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor="password-protection">Password Protection</Label>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            const newState = !isPasswordProtected;
                            setIsPasswordProtected(newState);
                            if (!newState) {
                                setValue("password", "");
                            }
                        }}
                        className="h-8 text-xs"
                    >
                        {isPasswordProtected ? (
                            <>
                                <LockOpen size={14} className="mr-1" />
                                Remove Protection
                            </>
                        ) : (
                            <>
                                <Lock size={14} className="mr-1" />
                                Add Protection
                            </>
                        )}
                    </Button>
                </div>
                
                {isPasswordProtected && (
                    <div className="relative">
                        <Input
                            {...register("password")}
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter password (min. 4 characters)"
                            className="pr-10"
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        >
                            {showPassword ? (
                                <EyeOff size={16} className="text-gray-400" />
                            ) : (
                                <Eye size={16} className="text-gray-400" />
                            )}
                        </Button>
                    </div>
                )}
                
                {errors.password && (
                    <p className="text-sm text-red-500">{errors.password.message}</p>
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
