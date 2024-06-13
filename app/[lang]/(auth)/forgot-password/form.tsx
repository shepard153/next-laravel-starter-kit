'use client';

import { ChangeEvent, FormEvent, useState, useTransition } from "react";
import FormInput from "@/components/forms/form-input";
import fetchServer from "@/actions/fetch-server";

export default function ForgottenPasswordForm({ dictionary }: { dictionary: Record<string, string> }) {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>();
    const [sent, setSent] = useState<boolean>(false);
    const [formData, setFormData] = useState({
        email: ''
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    }

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setError(null);

        startTransition(async () => {
            try {
                fetchServer({
                    method: "POST",
                    path: 'api/auth/forgot-password',
                    body: JSON.stringify(formData),
                    returns: 'all'
                }).then(async (response) => {
                    if (response.status === 422) {
                        const errors = response.data;

                        setError(errors.email)
                    } else {
                        setSent(true);
                    }
                });
            } catch (e) {
                console.log(e);

                setError("Default");
            }
        });
    }

    return (
        <form onSubmit={submit} className="flex flex-col space-y-6">
            <FormInput label={dictionary.email}
                       id="email"
                       name="email"
                       type="email"
                       onChange={handleChange}
                       error={error}
                       required
            />

            {sent ? (
                <div className="text-sm text-green-500">
                    {dictionary.reset_success}
                </div>
            ) : (
                <button type="submit"
                        disabled={isPending}
                        className="px-6 py-4 text-sm xl:text-base tracking-widest uppercase bg-qc-gold"
                >
                    {dictionary.reset_button}
                </button>
            )}
        </form>
    );
}