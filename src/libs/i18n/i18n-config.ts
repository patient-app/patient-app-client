// Central config file for locales

import { Config } from 'next-i18n-router/dist/types';

export const i18nConfig: Config = {
    locales: ['en', 'uk', 'de'],
    defaultLocale: 'en',
    localeDetector: false
};