import { Metadata } from "next";
import { type Locale, getDictionary } from "@/dictionaries";
import ProfileTitle from "./title";
import getMetadata from "@/actions/get-metadata";

export async function generateMetadata({ params }: { params: { lang: Locale } }): Promise<Metadata> {
    const dictionary = await getDictionary(params.lang);

    return getMetadata({
        dictionary: dictionary.seo.profile,
        path: `${params.lang}/profile`
    });
}


export default async function Profile({ params: { lang } }: { params: { lang: Locale } }) {
    const dictionary = await getDictionary(lang);

    return (
        <main className="flex flex-col">
            <ProfileTitle dictionary={dictionary.profile} />
        </main>
    );
}
