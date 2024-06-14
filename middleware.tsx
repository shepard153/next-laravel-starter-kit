import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
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
        } else if (user?.email_verified_at && (isGuestRoute || isVerifyRoute)) {
            authRedirectUrl = "/profile";
        }
    }

    const pathnameIsMissingLocale = i18n.locales.every(
        locale => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    );

    // Get query params
    const url = request.url;
    const urlParams = url.split('?')[1]
        ? `?${url.split('?')[1]}`
        : '';

    if (pathnameIsMissingLocale) {
        const locale = i18n.defaultLocale;

        return NextResponse.rewrite(
            new URL(
                `/${locale}${pathname.startsWith('/') ? '' : '/'}${authRedirectUrl ? authRedirectUrl : pathname}${urlParams}`,
                request.url
            )
        );
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

export const config = {
    // Matcher ignoring `/_next/` and `/api/`
    matcher: ["/((?!api|_next/static|_next/image|images|favicon.ico).*)"],
};
