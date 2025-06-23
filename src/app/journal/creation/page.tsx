"use client";


import {useRouter} from "next/navigation";
import {useTranslation} from "react-i18next";
import {useState} from "react";
import {JournalEntryCreationDTO} from "@/dto/input/JournalEntryCreationDTO";

const JournalEntryCreationPage = () => {
    const router = useRouter();
    const {t} = useTranslation();

    const [formData, setFormData] = useState<JournalEntryCreationDTO>({
        "title": "",
        "content": "",
        "tags": [],
        "sharedWithTherapist": false,
        "aiAccessAllowed": false
    });

    const [error, setError] = useState<string | null>(null);


    return (
        <main className="flex flex-col items-center justify-center w-full gap-5 p-5">
        <h1 className="text-3xl font-semibold">Journal Creation Page</h1>

    </main>
);
}
export default JournalEntryCreationPage;