"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const Page = () => {
    const router = useRouter();
    const [terms, setTerms] = useState<string>("Loading terms...");

    useEffect(() => {
        const fetchTerms = async () => {
            try {

                const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/patients/terms");
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error("Failed to fetch terms: " + (errorData.message || "Unknown error"));
                    setTerms("Failed to load terms.");
                    router.push("/");
                } else {
                    const data = await response.json(); // ⬅️ FIXED
                    setTerms(data.terms);
                }

            } catch (e) {
                console.error("Failed to fetch terms", e);
                setTerms("Error loading terms.");
                router.push("/");
            }
        };

        void fetchTerms();
    }, [router]);

    return (
        <>
            <div className="min-h-screen w-full flex flex-col items-center justify-start pt-18">

                <h2 className="text-2xl font-medium mb-3">Terms of Use</h2>

                <div className="flex gap-1 items-center text-base mt-2">
                    <Link href="/" className="text-emerald-600 hover:underline cursor-pointer">Close Terms</Link>
                </div>

                <div className="flex flex-col items-center gap-4 w-full" style={{ maxWidth: "40rem" }}>
                    <span dangerouslySetInnerHTML={{ __html: terms }} />
                </div>

                <div className="flex gap-1 items-center text-base mt-2">
                    <Link href="/" className="text-emerald-600 hover:underline cursor-pointer">Close Terms</Link>
                </div>
            </div>
        </>
    );
};

export default Page;
