import React from "react";
import type { Metadata } from "next";
import "@/globals.css";
import { type Locale, getDictionary } from "@/dictionaries";
import { Providers } from '@/providers';
import { i18n } from "../../i18n-config";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export async function generateMetadata({ params }: {
    params: { lang: Locale }
}): Promise<Metadata> {
    const dictionary = await getDictionary(params.lang);

    return {
        title: {
            template: '%s | Quality-Cover',
            default: 'Quality-Cover',
        },
        description: dictionary.seo.home_description,
        keywords: dictionary.seo.home_keywords,
    }
}

export async function generateStaticParams() {
    return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function RootLayout({ children, params }: Readonly<{
    children: React.ReactNode;
    params: { lang: Locale }
}>) {
    const dictionary = await getDictionary(params.lang);

    return (
        <html lang={params.lang}>
        <body className={`antialiased font-prompt bg-[#F9F6F5] [&>main]:max-w-[1920px] [&>main]:mx-auto`}>
        <Providers lang={params.lang}>
            <Navbar dictionary={dictionary.navbar}/>
            {children}
            <Footer dictionary={dictionary.footer}/>
        </Providers>
        </body>
        </html>
    );
}
