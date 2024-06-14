import useSWR from "swr";
import fetchServer from "@/actions/fetch-server";
import useSWRMutation from "swr/mutation";
import { SessionData, signOut } from "@/lib/Auth";

const defaultSession: SessionData = {
    user: {},
    accessToken: "",
    isLoggedIn: false,
};

async function doLogout(url: string) {
    return signOut().then(() => {
        return defaultSession;
    });
}

export default function useSession() {
    const { data: session, isLoading } = useSWR(
        'api/user',
        async (url) => {
            return await fetchServer({
                path: url,
                bearer: true,
            }).then((res) => {
                return res;
            });
        }
    );

    const { trigger: logout } = useSWRMutation('api/user', doLogout);

    return { session, logout, isLoading };
}