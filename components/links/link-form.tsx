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
import { useCreateLink, useUpdateLink } from "@/lib/queries/links";
import { useDebounceValue } from "usehooks-ts";
import { toast } from "sonner";
import AdvancedTargetingModal from "@/components/advanced-targeting-modal";
import PasswordModal from "@/components/password-modal";
import MetadataModal from "@/components/metadata-modal";

interface LinkFormProps {
    close: () => void;
    editMode?: boolean;
    editData?: {
        id: string;
        url: string;
        key: string;
        password?: string | null;
        geoTargeting?: Record<string, string> | null;
        deviceTargeting?: Record<string, string> | null;
        metadata?: Record<string, string> | null;
        expiresAt?: string | null;
    };
}

const LinkForm = ({ close, editMode = false, editData }: LinkFormProps) => {
    const [isPending, startTransition] = useTransition();
    const [defaultValues, setDefaultValues] = useState<ILinkForm | undefined>(undefined);
    const [geoTargeting, setGeoTargeting] = useState<Record<string, string> | undefined>();
    const [deviceTargeting, setDeviceTargeting] = useState<Record<string, string> | undefined>();
    const [password, setPassword] = useState<string | undefined>();
    const [metadata, setMetadata] = useState<
        { title?: string; description?: string; image?: string } | undefined
    >();

    // TanStack Query mutations for creating and updating links
    const createLinkMutation = useCreateLink();
    const updateLinkMutation = useUpdateLink();

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
                let defaultVals: ILinkForm;

                if (editMode && editData) {
                    // Use edit data for editing
                    defaultVals = {
                        url: editData.url,
                        key: editData.key,
                        password: editData.password || "",
                        geoTargeting: editData.geoTargeting || undefined,
                        deviceTargeting: editData.deviceTargeting || undefined,
                        metadata: editData.metadata || undefined,
                        expiresAt: editData.expiresAt || undefined,
                    };

                    // Set additional state for edit mode
                    setGeoTargeting(editData.geoTargeting || undefined);
                    setDeviceTargeting(editData.deviceTargeting || undefined);
                    setPassword(editData.password || undefined);
                    setMetadata(editData.metadata || undefined);
                } else {
                    // Load default values for create mode
                    defaultVals = await getDefaultValues();
                }

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
    }, [reset, setDefaultValues, editMode, editData]);

    const onSubmit = async (formData: ILinkForm) => {
        try {
            // Combine form data with targeting and security/metadata data
            const submitData = {
                ...formData,
                password,
                geoTargeting,
                deviceTargeting,
                metadata,
            };

            if (editMode && editData) {
                // Update existing link
                await updateLinkMutation.mutateAsync({
                    id: editData.id,
                    ...submitData,
                });
                toast.success("Link updated successfully!");
            } else {
                // Create new link
                await createLinkMutation.mutateAsync(submitData);
                toast.success("Link created successfully!");
            }

            // Reset form and close modal
            reset();
            setGeoTargeting(undefined);
            setDeviceTargeting(undefined);
            setPassword(undefined);
            setMetadata(undefined);
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
            // Skip validation in edit mode or if no key
            if (!debouncedKey || editMode) return;

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
    }, [debouncedKey, setError, clearErrors, trigger, editMode]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="destination">Destination URL</Label>
                <Input
                    {...register("url")}
                    id="url"
                    type="url"
                    placeholder="https://example.com/your-long-url"
                    disabled={editMode}
                    className={editMode ? "cursor-not-allowed opacity-50" : ""}
                />
                {errors.url && <p className="text-sm text-red-500">{errors.url.message}</p>}
            </div>

            <div className="space-y-2">
                <div className="flex items-center">
                    <Label className="flex-1">Short Link</Label>
                    {!editMode && (
                        <Button
                            disabled={isPending}
                            onClick={handleGenerateKey}
                            variant="outline"
                            size={"icon"}
                            className="h-[26px]"
                        >
                            <Shuffle size={16} />
                        </Button>
                    )}
                </div>
                <div className="flex gap-2">
                    <div className="bg-muted border-input flex items-center rounded-md border px-3 py-1 text-sm">
                        {siteConfig.url}
                    </div>
                    <div className="relative flex-1">
                        <Input
                            id="key"
                            placeholder="custom-key (optional)"
                            {...register("key")}
                            disabled={editMode}
                            className={editMode ? "cursor-not-allowed opacity-50" : ""}
                        />
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
                <Label className="text-sm font-medium">Advanced Settings (Optional)</Label>
                <div className="space-y-2">
                    <PasswordModal
                        password={password}
                        onSave={(newPassword) => setPassword(newPassword)}
                    />
                    <MetadataModal
                        metadata={metadata}
                        onSave={(newMetadata) => setMetadata(newMetadata)}
                    />
                    <AdvancedTargetingModal
                        geoTargeting={geoTargeting}
                        deviceTargeting={deviceTargeting}
                        onSave={(data) => {
                            setGeoTargeting(data.geoTargeting);
                            setDeviceTargeting(data.deviceTargeting);
                        }}
                    />
                </div>
            </div>

            <div className="border-t pt-4">
                <Button
                    type="submit"
                    disabled={
                        isSubmitting ||
                        !isValid ||
                        createLinkMutation.isPending ||
                        updateLinkMutation.isPending
                    }
                    className="float-right"
                >
                    {createLinkMutation.isPending || updateLinkMutation.isPending
                        ? editMode
                            ? "Updating..."
                            : "Creating..."
                        : editMode
                          ? "Update Link"
                          : "Create Link"}
                </Button>
            </div>
        </form>
    );
};

export default LinkForm;
