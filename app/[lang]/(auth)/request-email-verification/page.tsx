import { Metadata } from "next";
import Image from "next/image";
import { type Locale, getDictionary } from "@/dictionaries";
import Breadcrumbs from "@/components/utils/breadcrumbs";
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

    const breadcrumbPaths = [
        {
            title: dictionary.breadcrumbs.request_verification_notification
        }
    ];

    return (
        <main className="flex flex-col">
            <div className="hidden lg:block">
                <Breadcrumbs paths={breadcrumbPaths}
                             dictionary={dictionary.breadcrumbs}
                />
            </div>

            <div className="relative flex flex-col max-w-xl w-full mx-auto space-y-8 my-8 xl:my-20 px-4 xl:px-14 py-10 bg-white">
                <div className="flex flex-col">
                    <Image src="/images/q-cover-logo-mono.webp" alt="QC Logo" className="w-fit h-16 xl:h-20 mx-auto" width={46} height={80}/>
                    <div className="-mt-2 text-xs text-center text-gray-800/75 tracking-widest">
                        Q-Cover
                    </div>
                </div>
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