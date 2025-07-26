"use client";

import {LoginPatientDTO} from "@/dto/input/LoginPatientDTO";
import {useState, useEffect} from "react";
import {useTranslation} from "react-i18next";
import PasswordField from "@/components/PasswordField";
import {useRouter} from "next/navigation";
import {BASE_PATH} from "@/libs/constants";

const Login = () => {
    const { t, i18n } = useTranslation();

    const [, setLanguageReady] = useState(false);

    useEffect(() => {
        const savedLang = localStorage.getItem("lang");
        if (!savedLang) {
            const browserLang = navigator.language || navigator.languages[0];
            let preferredLang = browserLang.startsWith("uk") ? "uk" : "en";
            if(browserLang.startsWith("de")) preferredLang = "de";
            localStorage.setItem("lang", preferredLang);
            i18n.changeLanguage(preferredLang).then(() => {
                setLanguageReady(true); // rerender when done
            });
        } else {
            setLanguageReady(true); // already loaded
        }
    }, [i18n]);

    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState<LoginPatientDTO>({
        email: "",
        password: "",
    });
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!formData.email || !formData.password) {
            setError(t("login.error.emptyFields"));
            return;
        }
        try {
            const requestInit: RequestInit = {
                method: "POST",
                credentials: "include",
                body: JSON.stringify(formData),
                headers: {"Content-Type": "application/json"},
            };
            const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/patients/login", requestInit);
            if (!response.ok) {
                const errorData = await response.json();
                setError((t("login.error.loginFailed") + errorData.message) || t("login.error.loginTryAgain"));
            } else {
                await response.json();
                setShowPassword(false)
                router.push("/");
            }
        } catch (e) {
            setError(`t("login.error.loginTryAgain")`);
            console.error("Failed to login", e);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    return (

        <div className="min-h-screen w-full flex flex-col items-center justify-start pt-18">
            <h2 className="text-2xl font-medium mb-3">{t("login.title")}</h2>

            <form onSubmit={handleLogin} className="flex flex-col items-center gap-4 w-full"
                  style={{maxWidth: "20rem"}}>
                <div className="flex flex-col gap-2 w-full">
                    <label className="font-semibold" htmlFor="email">{t("login.email")}</label>
                    <input
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-emerald-600"
                        name="email"
                        type="email"
                        id="email"
                        placeholder={t("login.email")}
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <label className="font-semibold" htmlFor="password">{t("login.password")}</label>
                    <PasswordField
                        id="password"
                        value={formData.password}
                        placeholder={t("login.password")}
                        show={showPassword}
                        toggle={() => setShowPassword(!showPassword)}
                        onChange={handleChange}
                    />
                    <div className="flex gap-1 items-center text-base mt-2">
                        <span>{t("login.forgotPassword")}</span>
                        <a href={`${BASE_PATH}/reset-password`}
                           className="text-emerald-600 hover:underline cursor-pointer">{t("login.reset")}</a>
                    </div>

                    <button
                        className="w-full mt-3 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition cursor-pointer"
                        type="submit" color="primary">
                        {t("login.submit")}
                    </button>

                    {error && (
                        <div
                            className="w-full mt-2 px-4 py-2 bg-red-100 text-red-700 border border-red-300 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-1 items-center text-base mt-2">
                        <span className="italic">{t("login.noAccount")}</span>
                    </div>
                    <a   href={`${BASE_PATH}/terms`}  target="_blank" className="text-emerald-600 hover:underline w-full text-center">{t("footer.terms")}</a>


                </div>
            </form>
        </div>
    )
        ;
};

export default Login;