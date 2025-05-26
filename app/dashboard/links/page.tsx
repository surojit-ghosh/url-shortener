"use client";

import React from "react";
import { LinksHeader } from "./header";
import { CreateUrlModal } from "./create-url-modal";
import { useState } from "react";

const Links = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    return (
        <div className="container mx-auto max-w-6xl py-6">
            <LinksHeader />

            <CreateUrlModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </div>
    );
};

export default Links;
