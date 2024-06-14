'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";
import FormInput from "@/components/forms/form-input";
import SubmitButton from "@/components/forms/submit-button";
import { signIn } from "@/lib/Auth";


export default function LoginForm({ dictionary }: { dictionary: Record<string, string> }) {
    const [isPending, startTransition] = useTransition();
    const searchParams = useSearchParams();
    const router = useRouter();
    const [error, setError] = useState<string | null>(searchParams.get("error"));

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = new FormData(e.currentTarget);
        const formData = Object.fromEntries(form.entries());

        startTransition(async () => {
            try {
                const credentials = {
                    email: formData.email,
                    password: formData.password,
                };

                const callbackUrl = searchParams.get("callbackUrl") || "/profile";

                await signIn(credentials).then((response) => {
                    if (response.status === 200) {
                        router.push(callbackUrl);
                    }

                    if (response.status === 422) {
                        setError("CredentialsSignin");
                    }

                    if (response.status === 500) {
                        setError("Default");
                    }
                });
            } catch (e) {
                console.log(e);

                setError("Default");
            }
        });
    }

    return (
        <>
            <form onSubmit={submit} className="flex flex-col space-y-6">
                <FormInput label={dictionary.email}
                           id="email"
                           name="email"
                           type="email"
                           required
                />

                <FormInput label={dictionary.password}
                           id="password"
                           name="password"
                           type="password"
                           required
                />

                <SubmitButton text={dictionary.login_button} disabled={isPending} />
            </form>

            <FormError error={error} dictionary={dictionary} />
        </>
    );
}

function FormError({ error, dictionary }: { error: string | null, dictionary: Record<string, string> }) {
    if (!error) return null;

    const errorMessages: { [key: string]: string } = {
        CredentialsSignin: dictionary.invalid_credentials,
        Default: dictionary.default_error,
    };

    return <p className="absolute -top-3 xl:-top-6 left-0 w-full !mt-0 py-2 xl:py-4 text-center text-white tracking-wide bg-red-400">
        {errorMessages[error]}
    </p>;
}