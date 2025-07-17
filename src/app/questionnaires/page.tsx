"use client";

import { useTranslation } from "react-i18next";

const Questionnaires = () => {
    const { t } = useTranslation();

    return (
        <main className="flex flex-col items-center justify-center w-full gap-5 p-5">
            <h1 className="text-3xl font-semibold text-center">
                {t("questionnaires.title")}
            </h1>
        </main>
    );
};

export default Questionnaires;
