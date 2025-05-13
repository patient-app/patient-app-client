// Creates and initializes the i18next instance
import { Resource, createInstance, i18n } from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";

import { initReactI18next } from "react-i18next/initReactI18next";
import { i18nConfig } from "./i18n-config";

export type defaultNamespaces = "translation";
export const i18nNamespaces: defaultNamespaces[] = ["translation"]; //first namespace is default

export default async function initTranslations(
    locale: string,  //language to use
    namespaces: defaultNamespaces[],
    i18nInstance?: i18n,
    resources?: Resource // optional preloaded translation resources
) {
    const ns = namespaces.length > 0 ? namespaces : i18nNamespaces; //if namespace is passed use it, else use default
    const defaultNS = ns[0];

    i18nInstance = i18nInstance || createInstance(); //create a new instance if not passed
    i18nInstance.use(initReactI18next);
    i18nInstance.setDefaultNamespace(defaultNS);

    if (!resources) { //if no translation resources are passed, use the backend to load them
        i18nInstance.use(
            resourcesToBackend(
                (language: string, namespace: string) =>
                    import(`@/locales/${language}/${namespace}.json`)
            )
        );
    }

    await i18nInstance.init({
        ns,
        lng: locale,
        resources,
        fallbackLng: i18nConfig.defaultLocale,
        supportedLngs: i18nConfig.locales,
        defaultNS,
        fallbackNS: defaultNS,
        preload: resources ? [] : i18nConfig.locales,
        interpolation: {
            escapeValue: false,
        },
    });

    return {
        t: i18nInstance.t, //translation function
        i18n: i18nInstance,
        resources: i18nInstance.services.resourceStore.data,
    };
}