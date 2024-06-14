import { Suspense } from "react";
import { type Locale, getDictionary } from "@/dictionaries";
import Loading from "@/components/utils/loading";
import RegisterForm from './form';

export default async function Register({ params: { lang } }: { params: { lang: Locale } }) {
    const dictionary = await getDictionary(lang);

    return (
        <main className="flex flex-col">
            <div className="flex flex-col max-w-xl w-full mx-auto space-y-8 my-8 xl:my-20 px-4 xl:px-14 py-10 bg-white">
                <h1 className="font-medium text-2xl text-qc-black text-center tracing-widest uppercase">
                    {dictionary.auth.register.title}
                </h1>

                <p className="text-center text-gray-600 tracking-wide">
                    {dictionary.auth.register.description}
                </p>

                <Suspense fallback={<Loading/>}>
                    <RegisterForm dictionary={dictionary.auth.register}/>
                </Suspense>
            </div>
        </main>
    );
}