'use client';

import { FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import FormInput from "@/components/forms/form-input";
import SubmitButton from "@/components/forms/submit-button";
import { signIn } from "@/lib/Auth";
import fetchServer from "@/actions/fetch-server";

export default function RegisterForm({ dictionary }: { dictionary: Record<string, string> }) {
    const [isPending, startTransition] = useTransition();
    const [errors, setErrors] = useState<Record<string, string>>({});

    const router = useRouter();
    const redirect = () => router.push('/request-email-verification');

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = new FormData(e.currentTarget);
        const formData = Object.fromEntries(form.entries());

        setErrors({});

        startTransition(async () => {
            try {
                fetchServer({
                    method: "POST",
                    path: 'api/auth/register',
                    body: JSON.stringify(formData),
                    returns: 'all'
                }).then(async (response) => {
                    console.log(response)
                    if (response.status === 422) {
                        const errors = response.data;

                        return Object.keys(errors).map((errorKey) => {
                            setErrors({
                                ...errors,
                                [errorKey]: errors[errorKey][0]
                            })
                        });
                    } else {
                        const credentials = {
                            email: formData.email,
                            password: formData.password,
                        };

                        await signIn(credentials).then(redirect);
                    }
                });
            } catch (e) {
                console.log(e);
            }
        });
    }

    return (
        <form onSubmit={submit} className="flex flex-col space-y-6">
            <FormInput label={dictionary.name}
                       id="name"
                       name="name"
                       type="name"
                       error={errors.name}
                       required
            />

            <FormInput label={dictionary.email}
                       id="email"
                       name="email"
                       type="email"
                       error={errors.email}
                       required
            />

            <FormInput label={dictionary.password}
                       id="password"
                       name="password"
                       type="password"
                       error={errors.password}
                       required
            />

            <FormInput label={dictionary.password_confirmation}
                       id="password_confirmation"
                       name="password_confirmation"
                       type="password"
                       error={errors.password_confirmation}
                       required
            />

            <SubmitButton text={dictionary.register_button} disabled={isPending} />
        </form>
    );
}