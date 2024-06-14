'use client';

import { usePathname } from "next/navigation";
import Link from 'next/link';
import { i18n } from "../../i18n-config";

export default function Footer() {
    const pathname = usePathname();

    const redirectPathname = (lang: string) => {
        if (!pathname) return `/`;

        const pathnameIsMissingLocale = i18n.locales.every(
            locale => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
        );

        if (pathnameIsMissingLocale) {
            if (lang === i18n.defaultLocale) {
                return pathname;
            }

            return `/${lang}${pathname}`;
        } else {
            const segments = pathname.split('/');

            if (lang === i18n.defaultLocale) {
                if (segments.length === 2) {
                    return '/';
                }

                segments.splice(1, 1);
            } else {
                segments[1] = lang;
            }

            return segments.join('/');
        }
    }

    return (
        <nav className="fixed bottom-0 flex w-full bg-white drop-shadow">
            <div className="lg:container flex h-20 items-center justify-end space-x-2 mx-auto px-4">
                <Link href={redirectPathname('en')}>en</Link>
                <Link href={redirectPathname('pl')}>pl</Link>
            </div>
        </nav>
    );
}