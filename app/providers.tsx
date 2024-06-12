"use client";

import React from "react";
import LangProvider from "@/context/LangProvider";
import type { Locale } from "@/dictionaries";

export function Providers({ children, lang }: {
    children: React.ReactNode,
    lang: Locale
}) {
    return (
        <LangProvider lang={lang}>
            {children}
        </LangProvider>
    );
}