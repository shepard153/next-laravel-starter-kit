'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, FormEvent, useState, useTransition } from "react";
import FormInput from "@/components/forms/form-input";
import { signIn } from "@/lib/Auth";


type LoginForm = {
    email: string,
    password: string
};

export default function LoginForm({ dictionary }: { dictionary: Record<string, string> }) {
    const [isPending, startTransition] = useTransition();
    const searchParams = useSearchParams();
    const router = useRouter();
    const [error, setError] = useState<string | null>(searchParams.get("error"));
    const [formData, setFormData] = useState<LoginForm>({
        email: '',
        password: ''
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    }

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

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
                           onChange={handleChange}
                           required
                />

                <FormInput label={dictionary.password}
                           id="password"
                           name="password"
                           type="password"
                           onChange={handleChange}
                           required
                />

                <button type="submit"
                        disabled={isPending}
                        className="px-6 py-4 text-base text-white tracking-widest uppercase bg-sky-500"
                >
                    {dictionary.login_button}
                </button>
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

    return <p className="absolute -top-3 xl:-top-6 left-0 w-full !mt-0 py-2 xl:py-4 text-center text-white tracking-wide bg-red-400">{errorMessages[error]}</p>;
}