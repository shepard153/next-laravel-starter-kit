'use server';

import { getIronSessionData } from "@/lib/Auth";

type FetchServerProps = {
    method?: string;
    path: string;
    body?: string;
    params?: {};
    bearer?: boolean;
    tags?: Array<string>;
    returns?: 'status' | 'all' | null;
    cache?: RequestCache | undefined;
}

export type FetchServerResponse = {
    status: number;
    data: any;
} | number | undefined | any;

export default async function fetchServer({
        method = "GET",
        path,
        body = "",
        params = {},
        bearer = false,
        returns = null,
        tags = [],
        cache = 'force-cache'
}: FetchServerProps): Promise<FetchServerResponse> {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const apiKey = process.env.BACKEND_API_KEY || '';

    let session = null;

    if (bearer) {
        session = await getIronSessionData();

        if (! session?.accessToken) {
            return undefined;
        }
    }

    if (params) {
        const queryParams = new URLSearchParams(params).toString();

        path = `${path}?${queryParams}`;
    }

    const res = await fetch(`${backendUrl}/${path}`, {
        method,
        headers: new Headers({
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: bearer ? `Bearer ${session?.accessToken}` : ''
        }),
        body: body || undefined,
        next: {
            tags,
        },
        cache,
    });

    if (res.status === 422 || res.status === 404) {
        return {
            status: res.status,
            data: await res.json(),
        };
    }

    if (!res) {
        throw res;
    }

    switch (returns) {
        case 'status':
            return res.status;
        case 'all':
            return { status: res.status, data: await res.json() };
        default:
            return await res.json();
    }
}