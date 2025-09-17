import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React from "react";
import LinkModal from "./link-modal";
import { X, Search } from "lucide-react";

interface LinksHeaderProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
}

const LinksHeader = ({ searchTerm, onSearchChange }: LinksHeaderProps) => {
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onSearchChange(e.target.value);
    };

    const handleClearSearch = () => {
        onSearchChange("");
    };

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-semibold">Links</h1>

            <div className="flex justify-between gap-4">
                <div className="relative w-full sm:max-w-96">
                    <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                    <Input
                        className="w-full pr-10 pl-10"
                        placeholder="Search by key or URL..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    {searchTerm && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-1/2 right-1 h-6 w-6 -translate-y-1/2 p-0 hover:bg-transparent"
                            onClick={handleClearSearch}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
                <LinkModal />
            </div>
        </div>
    );
};

export { LinksHeader };
