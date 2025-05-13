// needed for translation in TypeScript
import Resources from './resources';
import {i18nNamespaces} from "@/libs/i18n/i18n";

declare module 'i18next' {
    interface CustomTypeOptions {
        defaultNS: i18nNamespaces[0];
        resources: Resources;
    }
}