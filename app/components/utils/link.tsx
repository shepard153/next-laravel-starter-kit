'use client';

import React from "react";
import NextLink from "next/link";
import { i18n } from "../../../i18n-config";
import { useLang } from "@/context/LangProvider";

export default function Link({ href, ...props }: Readonly<{
    href: string;
    children: React.ReactNode;
    [key: string]: any;
}>) {
    const lang = useLang()?.lang ?? i18n.defaultLocale;

    const isDefaultLocale = lang === i18n.defaultLocale;

    const path = isDefaultLocale ? href : `/${lang}${href}`;

    return (
        <NextLink href={path} {...props }>
            {props.children}
        </NextLink>
    );
}