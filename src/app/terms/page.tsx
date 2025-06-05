"use client";

import {useTranslation} from "react-i18next";

const Page = () => {
    const {t} = useTranslation();

    return (
        <>
            <div className="min-h-screen w-full flex flex-col items-center justify-start pt-18">

                <h2 className="text-2xl font-medium mb-3">{t("terms.title")}</h2>

                <button onClick={() => window.close()} className="text-emerald-600 hover:underline cursor-pointer">
                    {t("terms.closebutton")}
                </button>

                <div className="flex flex-col items-center gap-4 w-full" style={{ maxWidth: "40rem" }}>
                    <span dangerouslySetInnerHTML={{ __html: t("terms.text") }} />
                </div>

                <button onClick={() => window.close()} className="text-emerald-600 hover:underline cursor-pointer">
                    {t("terms.closebutton")}
                </button>
            </div>
        </>
    );
};

export default Page;
