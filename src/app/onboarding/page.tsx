"use client";

import {useRouter} from "next/navigation";
import {useState} from "react";
import {useTranslation} from "react-i18next";


const Login = () => {
    const router = useRouter();
    const {t} = useTranslation();

    const [screen, setScreen] = useState<1 | 2 | 3 | 4>(1);
    const [name, setName] = useState("");

    const handleNext = () => {
        if (screen < 4) {
            setScreen((prev) => (prev + 1) as 1 | 2 | 3 | 4);
        } else {
            // TODO: Save the onboarding data to the backend + mark onboarding as done
            router.push("/");
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center">
            {screen === 1 && (
                <div className="w-4/5 text-center space-y-4 p-20 rounded-md shadow-xl bg-gray-50">
                    <h2 className="text-2xl font-semibold">{t("onboarding.welcomeTitle")}</h2>
                    <p>{t("onboarding.welcomeText")}</p>
                    <button
                        onClick={handleNext}
                        className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition cursor-pointer"
                    >
                        {t("onboarding.continue")}
                    </button>
                    <div className="flex justify-center gap-2 mt-4">
                        <div className={"w-2.5 h-2.5 rounded-full border border-gray-400 bg-white"}></div>
                        <div className={"w-2.5 h-2.5 rounded-full border border-gray-400 bg-white"}></div>
                        <div className={"w-2.5 h-2.5 rounded-full border border-gray-400 bg-white"}></div>
                    </div>
                </div>
            )}

            {screen === 2 && (
                <div className="w-4/5 text-center space-y-4 p-20 rounded-md shadow-xl bg-gray-50">
                    <h2 className="text-2xl font-semibold">{t("onboarding.nameTitle")}</h2>
                    <div className="w-full flex justify-center">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={t("onboarding.namePlaceholder")}
                            className="px-4 py-2 border border-gray-300 rounded-md w-full max-w-xs"
                        />
                    </div>

                    <div className="w-full flex justify-center">
                        <button
                            onClick={handleNext}
                            disabled={!name.trim()}
                            className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition disabled:opacity-50 cursor-pointer"
                        >
                            {t("onboarding.continue")}
                        </button>
                    </div>
                    <div className="flex justify-center gap-2 mt-4">
                        <div className={"w-2.5 h-2.5 rounded-full border border-gray-400 bg-gray-400"}></div>
                        <div className={"w-2.5 h-2.5 rounded-full border border-gray-400 bg-white"}></div>
                        <div className={"w-2.5 h-2.5 rounded-full border border-gray-400 bg-white"}></div>
                    </div>
                </div>
            )}

            {screen === 3 && (
                <div className="w-4/5 text-center space-y-4 p-20 rounded-md shadow-xl bg-gray-50">
                    <h2 className="text-2xl font-semibold">{t("onboarding.infoTitle", { name })}</h2>
                    <p>{t("onboarding.infoText_1")}<br/>{t("onboarding.infoText_2")}</p>
                    <button
                        onClick={handleNext}
                        className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition cursor-pointer"
                    >
                        {t("onboarding.continue")}
                    </button>
                    <div className="flex justify-center gap-2 mt-4">
                        <div className={"w-2.5 h-2.5 rounded-full border border-gray-400 bg-gray-400"}></div>
                        <div className={"w-2.5 h-2.5 rounded-full border border-gray-400 bg-gray-400"}></div>
                        <div className={"w-2.5 h-2.5 rounded-full border border-gray-400 bg-white"}></div>
                    </div>
                </div>
            )}

            {screen === 4 && (
                <div className="w-4/5 text-center space-y-4 p-20 rounded-md shadow-xl bg-gray-50">
                    <h2 className="text-2xl font-semibold">{t("onboarding.configuredTitle")}</h2>
                    <p>{t("onboarding.configuredText")}</p>
                    <p><b>Role:</b> buddy<br/>
                    <b>Gender:</b> female<br/>
                    <b>Exercises:</b> journaling, breathing</p>

                    <div className="w-full flex justify-center">
                        <button
                            onClick={handleNext}
                            disabled={!name.trim()}
                            className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition disabled:opacity-50 cursor-pointer"
                        >
                            {t("onboarding.finish")}
                        </button>
                    </div>
                    <div className="flex justify-center gap-2 mt-4">
                        <div className={"w-2.5 h-2.5 rounded-full border border-gray-400 bg-gray-400"}></div>
                        <div className={"w-2.5 h-2.5 rounded-full border border-gray-400 bg-gray-400"}></div>
                        <div className={"w-2.5 h-2.5 rounded-full border border-gray-400 bg-gray-400"}></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;