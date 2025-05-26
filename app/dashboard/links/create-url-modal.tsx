"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { ControllerRenderProps } from "react-hook-form";

const createUrlSchema = z.object({
    destinationUrl: z.string().url("Please enter a valid URL"),
    customAlias: z.string().optional(),
    tags: z.string().optional(),
    comments: z.string().optional(),
});

type CreateUrlForm = z.infer<typeof createUrlSchema>;

interface CreateUrlModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreateUrlModal({ isOpen, onClose }: CreateUrlModalProps) {
    const form = useForm<CreateUrlForm>({
        resolver: zodResolver(createUrlSchema),
        defaultValues: {
            destinationUrl: "",
            customAlias: "",
            tags: "",
            comments: "",
        },
    });

    const onSubmit = async (data: CreateUrlForm) => {
        console.log("Creating short URL for:", data);
        form.reset();
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="text-xl">New link</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="destinationUrl"
                            render={({
                                field,
                            }: {
                                field: ControllerRenderProps<CreateUrlForm, "destinationUrl">;
                            }) => (
                                <FormItem>
                                    <FormLabel>Destination URL</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="https://example.com"
                                            {...field}
                                            className="w-full"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-4">
                            <div className="w-1/4">
                                <Label>Short Link</Label>
                                <Input value="dub.sh" disabled className="bg-muted" />
                            </div>
                            <FormField
                                control={form.control}
                                name="customAlias"
                                render={({
                                    field,
                                }: {
                                    field: ControllerRenderProps<CreateUrlForm, "customAlias">;
                                }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel className="sr-only">Custom Alias</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter a custom alias" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="tags"
                            render={({
                                field,
                            }: {
                                field: ControllerRenderProps<CreateUrlForm, "tags">;
                            }) => (
                                <FormItem>
                                    <FormLabel>Tags</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Select tags..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="comments"
                            render={({
                                field,
                            }: {
                                field: ControllerRenderProps<CreateUrlForm, "comments">;
                            }) => (
                                <FormItem>
                                    <FormLabel>Comments</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Add comments"
                                            {...field}
                                            className="resize-none"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-4">
                            <Button type="button" variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button type="submit" className="bg-black text-white hover:bg-black/90">
                                Create link
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
