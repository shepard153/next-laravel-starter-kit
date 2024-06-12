import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { i18n } from "./i18n-config";
import { getIronSessionData } from "@/lib/Auth";

const authRoutes = ["/profile"];
const verifyRoutes = ["/request-email-verification", "/verify-email"];
const guestRoutes = ["/forgot-password", "/login", "/password-reset", "/register"];

export async function middleware(request: NextRequest) {
    const session = await getIronSessionData();
    const user = session?.user;
    const token = session?.accessToken;

    const pathname = request.nextUrl.pathname;
    const isAuthRoute = authRoutes.some((route) => pathname.endsWith(route));
    const isVerifyRoute = verifyRoutes.some((route) => pathname.endsWith(route));
    const isGuestRoute = guestRoutes.some((route) => pathname.endsWith(route));

    if (!token && (isAuthRoute || isVerifyRoute)) {
        const redirectUrl = new URL("/login", request.url);

        redirectUrl.searchParams.set("callbackUrl", request.nextUrl.href);

        return NextResponse.redirect(redirectUrl);
    }

    let authRedirectUrl = null;

    if (token) {
        if (!user?.email_verified_at && (isAuthRoute || isGuestRoute)) {
            authRedirectUrl = "/request-email-verification";
        } else if (user?.email_verified_at && (isAuthRoute || isVerifyRoute)) {
            authRedirectUrl = "/profile";
        }
    }

    const pathnameIsMissingLocale = i18n.locales.every(
        locale => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    );

    if (pathnameIsMissingLocale) {
        const locale = getLocale(request);

        if (locale === i18n.defaultLocale) {
            return NextResponse.rewrite(
                new URL(
                    `/${locale}${pathname.startsWith('/') ? '' : '/'}${authRedirectUrl ? authRedirectUrl : pathname}`,
                    request.url
                )
            )
        }

        return NextResponse.redirect(
            new URL(
                `/${locale}${pathname.startsWith('/') ? '' : '/'}${authRedirectUrl ? authRedirectUrl : pathname}`,
                request.url
            )
        )
    }

    if (authRedirectUrl) {
        const urlLangPath = pathname.split('/')[1];

        return NextResponse.redirect(
            new URL(
                `/${urlLangPath}${pathname.startsWith('/') ? '' : '/'}${authRedirectUrl}`,
                request.url
            )
        );
    }
}

function getLocale(request: NextRequest): string | undefined {
    const negotiatorHeaders: Record<string, string> = {};
    request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

    // @ts-ignore locales are readonly
    const locales: string[] = i18n.locales;
    const languages = new Negotiator({ headers: negotiatorHeaders }).languages();

    return matchLocale(languages, locales, i18n.defaultLocale);
}

export const config = {
    // Matcher ignoring `/_next/` and `/api/`
    matcher: ["/((?!api|_next/static|_next/image|images|favicon.ico).*)"],
};
