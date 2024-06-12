'use server';

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getIronSession, SessionOptions } from "iron-session";
import getCsrf from "@/actions/get-csrf";
import fetchServer from "@/actions/fetch-server";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export type SessionData = {
    user: { [k: string]: any; };
    accessToken: string;
    isLoggedIn: boolean;
}

export type Credentials = {
    email: FormDataEntryValue | null,
    password: FormDataEntryValue | null
};

const sessionOptions: SessionOptions = {
    password: process.env.IRON_SESSION_SECRET || 'default-password-should-be-changed',
    cookieName: "laravel_auth_session",
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
    },
};

export async function getIronSessionData() {
    return await getIronSession<SessionData>(cookies(), sessionOptions);
}

export async function signIn(credentials: Credentials) {
    const session = await getIronSessionData();

    const { headers } = await getCsrf();

    const data = {
        email: credentials?.email,
        password: credentials?.password,
    };

    const res = await fetch(`${backendUrl}/api/auth/login`, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
        cache: 'no-store',
    });

    if (res.status === 200) {
        const data = await res.json();

        session.user = data.user;
        session.accessToken = data.access_token;
        session.isLoggedIn = true;

        await session.save();
    }

    if (res.status === 422) {
        return {
            status: res.status,
            data: await res.json(),
        };
    }

    return {
        status: res.status
    };
}

export async function emailVerified() {
    const session = await getIronSessionData();

    const response =  await fetchServer({
        path: "api/user",
        bearer: true,
        returns: "status",
    });

    if (response === 200) {
        session.user.email_verified_at = new Date().toISOString();
        await session.save();
    }
}

export async function signOut() {
    const session = await getIronSessionData();

    session.destroy();

    redirect('/');
}