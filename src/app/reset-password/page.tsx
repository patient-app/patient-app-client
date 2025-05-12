"use client";

import {ResetPasswordPatientDTO} from "@/dto/input/ResetPasswordPatientDTO";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import { useTranslation } from "react-i18next";


const Page = () => {
    const router = useRouter();
    const { t } = useTranslation();
    const [isClient, setIsClient] = useState(false);

    const [formData, setFormData] = useState<ResetPasswordPatientDTO>({
        email: "",
    });
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null)

        if (!formData.email) {
            return;
        }
        try {
            const requestInit: RequestInit = {
                method: "POST",
                credentials: "include",
                body: JSON.stringify(formData),
                headers: {"Content-Type": "application/json"},
            };
            const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/patients/reset-password", requestInit);
            if (!response.ok) {
                const errorData = await response.json();
                setError(( t("reset.error.resetFailed") + errorData.message) || t("reset.error.resetTryAgain"));
            } else {
                setSuccess(t("reset.success"));
                await new Promise(resolve => setTimeout(resolve, 5000));
                router.push("/login");
            }
        } catch (e) {
            setError(t("reset.error.resetTryAgain"));
            console.error("Failed to reset the password", e);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    return (
        <>
            {" "}
            <div className="min-h-screen w-full flex flex-col items-center justify-start pt-18">
                <h2 className="text-2xl font-medium mb-3">{t("reset.title")}</h2>

                <form onSubmit={handleReset} className="flex flex-col items-center gap-4 w-full" style={{ maxWidth: "20rem" }}>
                    <div className="flex flex-col gap-2 w-full">
                        <label className="font-semibold" htmlFor="email">{t("reset.email")}</label>
                        <input
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-emerald-600"
                            name="email"
                            type="email"
                            id="email"
                            placeholder={t("reset.email")}
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                        <button className="w-full mt-3 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition cursor-pointer"
                                type="submit" color="primary">{t("reset.submit")}
                        </button>

                        {error && (
                            <div className="w-full mt-2 px-4 py-2 bg-red-100 text-red-700 border border-red-300 rounded-md text-sm">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="w-full mt-2 px-4 py-2 bg-emerald-100 text-bg-emerald-600 border border-emerald-300 rounded-md text-sm">
                                {success}
                            </div>
                        )}

                        <div className="flex gap-1 items-center text-base mt-2">
                            <span>{t("reset.backToLogin")} </span>
                            <a href="/login" className="text-emerald-600 hover:underline cursor-pointer">{t("reset.login")}</a>
                        </div>
                    </div>
                </form>

                <div className="absolute bottom-4 text-sm text-gray-600 flex gap-2 justify-center">
                    <a href="/terms" className="text-emerald-600 hover:underline">{t("footer.terms")}</a>
                    <span>|</span>
                    <a href="/privacy" className="text-emerald-600 hover:underline">{t("footer.privacy")}</a>
                </div>
            </div>
        </>
    );
};

export default Page;