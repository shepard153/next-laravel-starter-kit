import { type Locale, getDictionary } from "@/dictionaries";

export default async function Profile({ params: { lang } }: { params: { lang: Locale } }) {
    const dictionary = await getDictionary(lang);

    return (
        <main className="flex flex-col">

        </main>
    );
}
