import { type Locale, getDictionary } from "@/dictionaries";

export default async function Home({ params: { lang } }: { params: { lang: Locale } }) {
    const dictionary = await getDictionary(lang);

    return (
        <main className="flex flex-col">
            <h1>{dictionary.home.title}</h1>
        </main>
    );
}
