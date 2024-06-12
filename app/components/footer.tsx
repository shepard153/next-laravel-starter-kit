import Link from '@/components/utils/link';

export default async function Navbar({ dictionary }: { dictionary: Record<string, string> }) {
    return (
        <nav className="fixed bottom-0 flex w-full bg-white drop-shadow">
            <div className="lg:container flex h-20 items-center justify-end space-x-2 mx-auto px-4">
                <Link href="/en">en</Link>
                <Link href="/pl">pl</Link>
            </div>
        </nav>
    );
}