import { Suspense } from "react";
import { Metadata } from "next";
import { type Locale, getDictionary } from "@/dictionaries";
import Loading from "@/components/utils/loading";
import Link from "@/components/utils/link";
import LoginForm from "./form";
import getMetadata from "@/actions/get-metadata";

export async function generateMetadata({ params }: { params: { lang: Locale } }): Promise<Metadata> {
    const dictionary = await getDictionary(params.lang);

    return getMetadata({
        dictionary: dictionary.seo.login,
        path: `${params.lang}/login`
    });
}

export default async function Login({ params: { lang } }: { params: { lang: Locale } }) {
    const dictionary = await getDictionary(lang);

    return (
        <main className="flex flex-col">
            <div className="relative flex flex-col max-w-xl w-full mx-auto space-y-8 my-8 xl:my-20 px-4 xl:px-14 py-10 bg-white">
                <h1 className="font-medium text-2xl text-qc-black text-center tracing-widest uppercase">
                    {dictionary.auth.login.title}
                </h1>

                <Suspense fallback={<Loading/>}>
                    <LoginForm dictionary={dictionary.auth.login}/>
                </Suspense>

                <div className="flex flex-col text-center text-gray-600 space-y-4">
                    <div className="max-w-52 sm:max-w-sm mx-auto">
                        <span>{dictionary.auth.login.do_not_have_account} - </span>

                        <Link href="/register" className="text-qc-bronze hover:text-qc-gold underline">
                            {dictionary.auth.login.register_button}
                        </Link>
                    </div>

                    <Link href="/forgot-password" className="text-qc-bronze hover:text-qc-gold underline">
                        {dictionary.auth.login.forgot_password}
                    </Link>
                </div>
            </div>
        </main>
    );
}
