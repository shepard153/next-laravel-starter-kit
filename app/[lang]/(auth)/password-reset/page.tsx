import { Suspense } from "react";
import { getDictionary, Locale } from "@/dictionaries";
import ForgottenPasswordForm from "./form";
import Loading from "@/components/utils/loading";

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