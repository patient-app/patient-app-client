import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import 'react-chatbot-kit/build/main.css';
import Navigation from "../components/Navigation";
import Link from "next/link";
import React from "react";
import TranslationsProvider from "@/libs/provider/translation-provider";
import {ReactNode} from "react";
import initTranslations, {i18nNamespaces} from "@/libs/i18n/i18n";

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'], preload: false });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'], preload: false });

export const metadata: Metadata = {
    title: "Lumina",
    description: "To support clients.",
};

interface LayoutProps {
    children: ReactNode;
    params: Promise<{
        locale: string;
    }>;
}

export default async function RootLayout({
                                             children, params
                                         }: Readonly<LayoutProps>) {
    const {locale} = await params;
    const {resources} = await initTranslations(locale, i18nNamespaces);
    return (
        <html lang="en">
        <head>
            <meta className="viewport" content="width=decive-width, initial-scale=1"/>
            <title>Patient&#39;s App</title>
        </head>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>

        <TranslationsProvider
            namespaces={i18nNamespaces}
            locale={locale}
            resources={resources}
        >
        {/* Top-left clickable title: */}
        <Link
            href="/"
            className="absolute top-4 left-4 text-2xl font-bold uppercase cursor-pointer z-10"
        >
            <span className="text-3xl">L</span>umina
        </Link>

        {/* Horizontal layout: sidebar + page content: */}
        <div className="flex min-h-screen">
            <Navigation />
            <main className="flex-1 pt-15 px-6 pb-6 h-screen overflow-y-auto">{children}</main>
        </div>

        </TranslationsProvider>
        </body>

        </html>
    );
}
