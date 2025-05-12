import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import 'react-chatbot-kit/build/main.css';
import TermsLink from "../components/TermsLink";
import Navigation from "../components/Navigation";
import Link from "next/link";
import React from "react";

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
    title: "Patient's Application",
    description: "To support clients.",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <head>
            <meta className="viewport" content="width=decive-width, initial-scale=1"/>
            <title>Patient&#39;s App</title>
        </head>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Top-left clickable title: */}
        <Link
            href="/"
            className="absolute top-4 left-4 text-2xl font-bold uppercase cursor-pointer z-10"
        >
            <span className="text-3xl">P</span>atient&#39;s <span className="text-3xl">A</span>pp
        </Link>

        {/* Horizontal layout: sidebar + page content: */}
        <div className="flex min-h-screen">
            <Navigation />
            <main className="flex-1 p-6 mt-13">{children}</main>
        </div>

        {/* Terms and Conditions: */}
        <TermsLink />
        </body>

        </html>
    );
}
