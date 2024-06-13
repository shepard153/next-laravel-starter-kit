'use client';

import { redirect } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";
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
                    <button type="submit"
                            disabled={isPending}
                            className="px-6 py-4 text-sm text-white xl:text-base tracking-widest uppercase bg-sky-500"
                    >
                        {isPending ? dictionary.sending : dictionary.resend_button}
                    </button>
                )}
            </form>

            {errors && <p className="text-red-500">{errors}</p>}
        </>
    );
}