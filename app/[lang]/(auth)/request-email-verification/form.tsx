'use client';

import { redirect } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";
import SubmitButton from "@/components/forms/submit-button";
import useSession from "@/hooks/use-session";
import fetchServer from "@/actions/fetch-server";

export default function Form({ dictionary }: { dictionary: Record<string, string> }) {
    const { session } = useSession()
    const [isPending, startTransition] = useTransition();
    const [mailSent, setMailSent] = useState(false);
    const [errors, setErrors] = useState('');

    if (session?.user?.email_verified_at) {
        redirect("/profile");
    }

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        startTransition(async () => {
            fetchServer({
                path: 'api/auth/email/verification-notification',
                method: 'POST',
                bearer: true,
                returns: 'status'
            }).then(status => {
                if (status === 200) {
                    setMailSent(true);
                    setErrors('');
                }

                if (status === 401) {
                    setErrors(dictionary.unauthorized_error);
                }
            });
        });
    }

    return (
        <>
            <form onSubmit={submit} className="flex flex-col">
                {mailSent ? (
                        <div className="text-sm text-center text-green-500">
                            {dictionary.sent}
                        </div>
                    ) : (
                    <SubmitButton text={dictionary.resend_button} disabled={isPending} />
                )}
            </form>

            {errors && <p className="text-red-500">{errors}</p>}
        </>
    );
}