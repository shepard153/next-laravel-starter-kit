import { Metadata } from "next";
import { Suspense } from "react";
import { getDictionary, Locale } from "@/dictionaries";
import ForgottenPasswordForm from "./form";
import getMetadata from "@/actions/get-metadata";
import Loading from "@/components/utils/loading";

export async function generateMetadata({ params }: { params: { lang: Locale } }): Promise<Metadata> {
    const dictionary = await getDictionary(params.lang);

    return getMetadata({
        dictionary: dictionary.seo.password_reset,
        path: `${params.lang}/password-reset`
    });
}

export default async function PasswordReset({ params: { lang } }: { params: { lang: Locale } }) {
    const dictionary = await getDictionary(lang);
    return (
        <main className="flex flex-col">
            <div className="relative flex flex-col max-w-xl w-full mx-auto space-y-8 my-8 xl:my-20 px-4 xl:px-14 py-10 bg-white">
                <h1 className="font-medium text-2xl text-qc-black text-center tracing-widest uppercase">
                    {dictionary.auth.password_reset.title}
                </h1>

                <p className="text-center text-gray-600 tracking-wide">
                    {dictionary.auth.password_reset.description}
                </p>

                <Suspense fallback={<Loading/>}>
                    <ForgottenPasswordForm dictionary={dictionary.auth.password_reset}/>
                </Suspense>
            </div>
        </main>
    );
}