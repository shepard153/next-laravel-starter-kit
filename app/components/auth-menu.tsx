'use client';

import Link from '@/components/utils/link';
import useSession from "@/hooks/use-session";

export default function AuthMenu({ dictionary }: { dictionary: Record<string, string>}){
    const { session, logout } = useSession();

    const guestUserMenu = (
        <div>
            <Link href="/login"
                  className="w-full px-4 text-qc-bronze-dark no-underline"
            >
                {dictionary.login}
            </Link>

            <Link href="/register"
                  className="w-full px-4 text-qc-bronze-dark no-underline"
            >
                {dictionary.register}
            </Link>
        </div>
    );

    const userMenu = (
        <div>
            <Link href="/profile"
                  className="w-full px-4 text-qc-bronze-dark no-underline"
            >
                {dictionary.profile}
            </Link>

            <Link href="#"
                  onClick={() => logout()}
                  className="w-full px-4 text-qc-bronze-dark no-underline"
            >
                {dictionary.logout}
            </Link>
        </div>
    );

    return (
        <>
            {session?.user ? userMenu : guestUserMenu}
        </>
    )
}