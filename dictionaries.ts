import 'server-only';
import { i18n } from "./i18n-config";

export type Locale = (typeof i18n)["locales"][number];

const dictionaries = {
    en: () => import('./dictionaries/en.json').then((module) => module.default),
    pl: () => import('./dictionaries/pl.json').then((module) => module.default),
}


// @ts-ignore
export const getDictionary = async (locale: Locale) => dictionaries[locale]?.() ?? dictionaries.en();