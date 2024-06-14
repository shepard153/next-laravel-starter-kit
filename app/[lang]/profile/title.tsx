'use client';

import useSession from "@/hooks/use-session";

export default function ProfileTitle({ dictionary }: { dictionary: Record<string, string> }) {
    const { session, logout } = useSession();

    return (
        <div className="mt-8">
            {session?.user &&  (
                <h1 className="text-center">
                    {dictionary.title.replace(":name", session?.user.name)}
                </h1>
            )}
        </div>
    )
}