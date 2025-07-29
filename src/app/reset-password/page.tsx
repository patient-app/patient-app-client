"use client";

import {ResetPasswordPatientDTO} from "@/dto/input/ResetPasswordPatientDTO";
import {useState} from "react";
import { useTranslation } from "react-i18next";
import {BASE_PATH} from "@/libs/constants";


const Page = () => {
    const { t } = useTranslation();

    const [formData, setFormData] = useState<ResetPasswordPatientDTO>({
        email: "",
    });
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [waiting, setWaiting] = useState<boolean>(false);


    const handleReset = async (e: React.FormEvent) => {
        setWaiting(true);
        e.preventDefault();
        setError(null);
        setSuccess(null);

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
                setFormData({ email: "" });
            }
        } catch (e) {
            setError(t("reset.error.resetTryAgain"));
            console.error("Failed to reset the password", e);
        }
        setWaiting(false);
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

                        {waiting && (
                            <div className="w-full mt-2 px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-md text-sm">
                                {t("reset.waiting")}
                            </div>
                        )}

                        {error && (
                            <div className="w-full mt-2 px-4 py-2 bg-red-100 text-red-700 border border-red-300 rounded-md text-sm">
                                {error}
                            </div>
                        )}

                        {success && (
                            <>
                                <div
                                    className="w-full mt-2 px-4 py-2 bg-emerald-100 text-bg-emerald-600 border border-emerald-300 rounded-md text-sm">
                                    {success}
                                </div>
                                <div
                                    className="w-full mt-2 px-4 py-2 bg-yellow-100 text-yellow-900 border border-yellow-300 rounded-md text-sm">
                                    {t("reset.spamInformation")}
                                </div>
                            </>
                    )}

                        <div className="flex gap-1 items-center text-base mt-2">
                            <span>{t("reset.backToLogin")} </span>
                            <a href={`${BASE_PATH}/login`} className="text-emerald-600 hover:underline cursor-pointer">{t("reset.login")}</a>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Page;