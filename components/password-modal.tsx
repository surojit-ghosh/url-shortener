"use client";

import { useState, useEffect } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface PasswordModalProps {
    password?: string;
    onSave: (password?: string) => void;
    trigger?: React.ReactNode;
}

const PasswordModal = ({ password: initialPassword, onSave, trigger }: PasswordModalProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState(initialPassword || "");

    useEffect(() => {
        if (isOpen) {
            setPassword(initialPassword || "");
        }
    }, [isOpen, initialPassword]);

    const handleSave = () => {
        // Validate password if provided
        if (password && password.length > 0 && password.length < 4) {
            toast.error("Password must be at least 4 characters long");
            return;
        }

        onSave(password || undefined);
        setIsOpen(false);
        toast.success("Password settings saved!");
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button
                        type="button"
                        variant="outline"
                        className="flex w-full items-center justify-start gap-2"
                    >
                        <Lock size={16} />
                        <span className="flex-1 text-start">Password Protection</span>

                        {password && password.length > 0 && (
                            <Badge variant="secondary" className="text-xs">
                                Protected
                            </Badge>
                        )}
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Lock size={20} />
                        Password Protection
                    </DialogTitle>
                    <DialogDescription>Require a password to access this link</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter password (min. 4 characters)"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pr-10"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                            >
                                {showPassword ? (
                                    <EyeOff size={16} className="text-gray-400" />
                                ) : (
                                    <Eye size={16} className="text-gray-400" />
                                )}
                            </Button>
                        </div>
                        {password && password.length > 0 && password.length < 4 && (
                            <p className="text-xs text-red-500">
                                Password must be at least 4 characters long
                            </p>
                        )}
                    </div>
                </div>

                <Separator />

                <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                        Cancel
                    </Button>
                    <Button type="button" onClick={handleSave}>
                        Save Password
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default PasswordModal;
