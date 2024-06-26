"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useState, FormEvent } from "react";
import SubmitButton from "@/components/forms/submit-button";
import { emailVerified } from "@/lib/Auth";
import fetchServer from "@/actions/fetch-server";

export default function VerifyEmailForm({ dictionary }: { dictionary: Record<string, string> }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState<string | null>();
    const [isPending, startTransition] = useTransition();

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        startTransition(async () => {
            try {
                const url = searchParams.get("verify");

                if (!url) {
                    setError(dictionary.verification_error);
                }

                const response = await fetchServer({
                    path: `api/auth/verify-email/${url}`,
                    bearer: true,
                    returns: "status"
                })

                if (response !== 200) {
                    setError(dictionary.verification_error);
                } else {
                    await emailVerified().then(() => {
                        router.push("/profile")
                    });
                }
            } catch (error) {
                console.log(error);
                setError(dictionary.verification_error);
            }
        });
    }

    return (
        <form onSubmit={submit} className="flex flex-col">
            <SubmitButton text={dictionary.verify_button} disabled={isPending} />

            {error && <div className="text-red-500">{error}</div>}
        </form>
    );
}