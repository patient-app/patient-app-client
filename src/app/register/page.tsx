"use client";

import {RegisterPatientDTO} from "@/dto/input/RegisterPatientDTO";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {useTranslation} from "react-i18next";
import PasswordField from "@/components/PasswordField";


const Register = () => {
    const router = useRouter();
    const {t} = useTranslation();

    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState<RegisterPatientDTO>({
        email: "",
        password: "",
    });
    const [error, setError] = useState<string | null>(null);


    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!formData.email || !formData.password) {
            setError(t("register.error.emptyFields"));
            return;
        }
        try {
            const requestInit: RequestInit = {
                method: "POST",
                credentials: "include",
                body: JSON.stringify(formData),
                headers: {"Content-Type": "application/json"},
            };
            const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/patients/register", requestInit);
            if (!response.ok) {
                const errorData = await response.json();
                setError((t("register.error.registrationFailed") + errorData.message) || t("register.error.registrationTryAgain"));
                console.log(errorData)
            } else {
                setShowPassword(false);
                router.push("/");
            }
        } catch (e) {
            setError(t("register.error.registrationTryAgain"));
            console.error("Failed to register", e);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    return (
        <>
            {" "}
            <div className="min-h-screen w-full flex flex-col items-center justify-start pt-18">
                <h2 className="text-2xl font-medium mb-3">{t("register.title")}</h2>

                <form onSubmit={handleRegister} className="flex flex-col items-center gap-4 w-full"
                      style={{maxWidth: "20rem"}}>
                    <div className="flex flex-col gap-2 w-full">
                        <label className="font-semibold" htmlFor="email">{t("register.email")}</label>
                        <input
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-emerald-600"
                            name="email"
                            type="email"
                            id="email"
                            placeholder={t("register.email")}
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                        <label className="font-semibold" htmlFor="password">{t("register.password")}</label>
                        <PasswordField
                            id="password"
                            value={formData.password}
                            placeholder={t("register.password")}
                            show={showPassword}
                            toggle={() => setShowPassword(!showPassword)}
                            onChange={handleChange}
                        />
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="terms"
                                name="terms"
                                required
                                onInvalid={(e) => e.currentTarget.setCustomValidity("Please accept the terms and conditions to proceed.")}
                                onChange={(e) => e.currentTarget.setCustomValidity("")}
                                className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-0"
                            />
                            <label htmlFor="terms" className="text-sm text-gray-700">
                                I accept the <a href="/terms" target="_blank"
                                                className="text-emerald-600 hover:underline">terms and conditions</a>.
                            </label>
                        </div>
                        <button
                            className="w-full mt-3 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition cursor-pointer"
                            type="submit" color="primary"> Register
                        </button>

                        {error && (
                            <div
                                className="w-full mt-2 px-4 py-2 bg-red-100 text-red-700 border border-red-300 rounded-md text-sm">
                                {error}
                            </div>
                        )}

                        <div className="flex gap-1 items-center text-base mt-2">
                            <span>{t("register.haveAccount")}</span>
                            <a href="/login"
                               className="text-emerald-600 hover:underline cursor-pointer">{t("register.login")}</a>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Register;