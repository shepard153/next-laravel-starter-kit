'use client';

import { ChangeEvent, FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import FormInput from "@/components/forms/form-input";
import { signIn } from "@/lib/Auth";
import fetchServer from "@/actions/fetch-server";

type RegisterForm = {
    email: string,
    password: string,
    password_confirmation: string
};

export default function RegisterForm({ dictionary }: { dictionary: Record<string, string> }) {
    const [isPending, startTransition] = useTransition();
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [formData, setFormData] = useState<RegisterForm>({
        email: '',
        password: '',
        password_confirmation: ''
    });

    const router = useRouter();
    const redirect = () => router.push('/request-email-verification');

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
                    path: 'api/auth/register',
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
            <FormInput label={dictionary.email}
                       id="email"
                       name="email"
                       type="email"
                       error={errors.email}
                       onChange={handleChange}
                       required
            />

            <FormInput label={dictionary.password}
                       id="password"
                       name="password"
                       type="password"
                       error={errors.password}
                       onChange={handleChange}
                       required
            />

            <FormInput label={dictionary.password_confirmation}
                       id="password_confirmation"
                       name="password_confirmation"
                       type="password"
                       error={errors.password_confirmation}
                       onChange={handleChange}
                       required
            />

            <button type="submit"
                    disabled={isPending}
                    className="px-6 py-4 text-base text-white tracking-widest uppercase bg-sky-500 rounded-none shadow-none"
            >
                {dictionary.register_button}
            </button>
        </form>
    );
}