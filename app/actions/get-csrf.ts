'use server';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
const backendCookieName = process.env.BACKEND_COOKIE_NAME;

type LaravelHeaders = {
    sessionKey: string | null,
    xsrfToken: string | null,
    headers: Headers
}

export default async function getCsrf(): Promise<LaravelHeaders> {
    const res = await fetch(`${backendUrl}/sanctum/csrf-cookie`, {
        method: "GET",
        cache: 'no-store',
    });

    const setCookieHeader = res.headers.get("set-cookie")
    const cookies = setCookieHeader?.split(", ")

    let sessionKey = null
    let xsrfToken = null

    for (const cookie of cookies!) {
        if (cookie.startsWith(`${backendCookieName}=`)) {
            sessionKey = cookie.split("=")[1]
        } else if (cookie.startsWith("XSRF-TOKEN=")) {
            xsrfToken = cookie.split("=")[1]
        }

        if (sessionKey && xsrfToken) {
            break
        }
    }

    if (!res.ok) {
        throw new Error('Failed to fetch data');
    }

    const headers = new Headers({
        Cookie: `${backendCookieName}=${sessionKey}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
    })

    if (xsrfToken) {
        headers.append("X-XSRF-TOKEN", xsrfToken)
    }

    return { sessionKey, xsrfToken, headers }
}