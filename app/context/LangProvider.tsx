import React from "react";
import { getDictionary, Locale } from "@/dictionaries";

type State = { lang: Locale };

const LangContext = React.createContext<State|null>({
    lang: "pl"
});

export default function LangProvider({ children, lang }: Readonly<{
    children: React.ReactNode;
    lang: Locale
}>) {
    //const dictionary = await getDictionary(lang);

    const state = { lang };

    return (
        <LangContext.Provider value={state}>
            {children}
        </LangContext.Provider>
    );
}

export function useLang() {
    const context = React.useContext(LangContext)

    if (context === undefined) {
        throw new Error('useLang must be used within a LangProvider')
    }

    return context
}