"use client";

import React from "react";
import { LinksHeader } from "@/components/links/header";
import AllLinks from "@/components/links/all-links";

const Links = () => {
    return (
        <div className="container mx-auto max-w-6xl py-6">
            <LinksHeader />
            <AllLinks />
        </div>
    );
};

export default Links;
