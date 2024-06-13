import { Metadata } from "next";
import Image from "next/image";
import { type Locale, getDictionary } from "@/dictionaries";
import Form from "./form";
import getMetadata from "@/actions/get-metadata";

export async function generateMetadata({ params }: { params: { lang: Locale } }): Promise<Metadata> {
    const dictionary = await getDictionary(params.lang);

    return getMetadata({
        dictionary: dictionary.seo.request_verification_notification,
        path: `${params.lang}/request-email-verification`
    });
}

export default async function RequestEmailVerification({ params: { lang } }: { params: { lang: Locale } }) {
    const dictionary = await getDictionary(lang);

    return (
        <main className="flex flex-col">
            <div className="relative flex flex-col max-w-xl w-full mx-auto space-y-8 my-8 xl:my-20 px-4 xl:px-14 py-10 bg-white">
                <h1 className="font-medium text-2xl text-qc-black text-center tracing-widest uppercase">
                    {dictionary.auth.request_verification_notification.title}
                </h1>

                <p className="text-center text-gray-600 tracking-wide">
                    {dictionary.auth.request_verification_notification.description}
                </p>

                <Form dictionary={dictionary.auth.request_verification_notification}/>
            </div>
        </main>
    );
}