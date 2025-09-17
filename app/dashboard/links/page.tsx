"use client";

import React, { useState, useEffect } from "react";
import { LinksHeader } from "@/components/links/header";
import AllLinks from "@/components/links/all-links";

const Links = () => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");

    // Simple debounce implementation
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    return (
        <div className="container mx-auto max-w-6xl py-6">
            <LinksHeader searchTerm={searchTerm} onSearchChange={setSearchTerm} />
            <AllLinks searchTerm={debouncedSearchTerm} />
        </div>
    );
};

export default Links;
