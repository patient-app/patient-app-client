// Sets up and injects a configured i18n instance into the application
'use client';

import {Resource, createInstance} from 'i18next';
import {ReactNode, useEffect, useState} from 'react';
import {I18nextProvider} from 'react-i18next';
import initTranslations, {defaultNamespaces} from '../i18n/i18n';
import {i18nConfig} from "@/libs/i18n/i18n-config";
/* eslint-disable @typescript-eslint/no-explicit-any */


export default function TranslationsProvider({
                                                 children,
                                                 locale,
                                                 namespaces,
                                                 resources,
                                             }: Readonly<{
    children: ReactNode;
    locale: string;
    namespaces: defaultNamespaces[];
    resources?: Resource;
}>) {
    const [i18nInstance, setI18nInstance] = useState<any | null>(null);

    useEffect(() => {
        const lang =
            (typeof window !== 'undefined' && localStorage.getItem('lang')) ||
            locale ||
            i18nConfig.defaultLocale;

        const instance = createInstance();

        initTranslations(lang, namespaces, instance, resources).then(() => {
            setI18nInstance(instance);
        });
    }, [locale, namespaces, resources]);

    if (!i18nInstance) return null;

    return <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>;
}
