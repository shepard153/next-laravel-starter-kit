import { type Locale, getDictionary } from "@/dictionaries";
import ProfileTitle from "@/[lang]/profile/title";

export default async function Profile({ params: { lang } }: { params: { lang: Locale } }) {
    const dictionary = await getDictionary(lang);

    return (
        <main className="flex flex-col">
            <ProfileTitle dictionary={dictionary.profile} />
        </main>
    );
}
