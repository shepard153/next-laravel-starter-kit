import Link from '@/components/utils/link';
import AuthMenu from "./auth-menu";

export default async function Navbar({ dictionary }: { dictionary: Record<string, string> }) {
    return (
        <nav className="bg-white shadow-lg">
            <div className="lg:container flex h-20 items-center justify-between mx-auto px-4">
                <Link href="/">{dictionary.home}</Link>

                <div className="flex space-x-1">
                    <AuthMenu dictionary={dictionary as Record<string, string>} />
                </div>
            </div>
        </nav>
    );
}