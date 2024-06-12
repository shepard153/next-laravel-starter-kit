'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, FormEvent, useState, useTransition } from "react";
import FormInput from "@/components/forms/form-input";
import fetchServer from "@/actions/fetch-server";

export default function ForgottenPasswordForm({ dictionary }: { dictionary: Record<string, string> }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formData, setFormData] = useState({
        password: '',
        password_confirmation: '',
        token: searchParams.get('token') || '',
        email: searchParams.get('email') || ''
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    }

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

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
                       onChange={handleChange}
                       error={errors.password}
                       required
            />

            <FormInput label={dictionary.password_confirmation}
                       id="password_confirmation"
                       name="password_confirmation"
                       type="password"
                       onChange={handleChange}
                       error={errors.password_confirmation}
                       required
            />

            <button type="submit"
                    disabled={isPending}
                    className="px-6 py-4 text-sm xl:text-base tracking-widest uppercase bg-qc-gold rounded-none shadow-none"
            >
                {dictionary.reset_button}
            </button>
        </form>
    );
}