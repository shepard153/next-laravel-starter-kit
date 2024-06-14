'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, FormEvent, useState, useTransition } from "react";
import FormInput from "@/components/forms/form-input";
import SubmitButton from "@/components/forms/submit-button";
import fetchServer from "@/actions/fetch-server";

export default function ForgottenPasswordForm({ dictionary }: { dictionary: Record<string, string> }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [errors, setErrors] = useState<Record<string, string>>({});

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = new FormData(e.currentTarget);
        const formData = Object.fromEntries(form.entries());

        setErrors({});

        startTransition(async () => {
            try {
                fetchServer({
                    method: "POST",
                    path: 'api/auth/reset-password',
                    body: JSON.stringify(formData),
                    returns: 'all'
                }).then(async (response) => {
                    if (response.status === 422) {
                        const errors = response.data;

                        return Object.keys(errors).map((errorKey) => {
                            setErrors({
                                ...errors,
                                [errorKey]: errors[errorKey][0]
                            })
                        });
                    } else {
                        router.push('/login');
                    }
                });
            } catch (e) {
                console.log(e);
            }
        });
    }

    return (
        <form onSubmit={submit} className="flex flex-col space-y-6">
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

            <SubmitButton text={dictionary.reset_button} disabled={isPending} />
        </form>
    );
}