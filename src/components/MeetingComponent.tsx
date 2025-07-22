"use client";

import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {MeetingDTO} from "@/dto/output/MeetingDTO";

const MeetingComponent = () => {
    const [meetings, setMeetings] = useState<MeetingDTO[]>([]);
    const {t} = useTranslation();

    useEffect(() => {
        const fetchMeetings = async () => {
            try {
                const requestInit: RequestInit = {
                    method: "GET",
                    credentials: "include",
                };
                const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/patients/meetings", requestInit);
                console.log(response)
                if (!response.ok) {
                    console.warn("Failed to fetch meetings");
                    return;
                }

                const data = await response.json();
                setMeetings(data);
            } catch (e) {
                console.error(e);
                return;
            }
        };

        fetchMeetings();
    }, []);

    return (
        <div
            className="w-[90%] lg:w-[65%] border border-gray-300 shadow-md bg-white p-4 rounded-md mb-4">
            <h2 className="text-xl font-semibold mb-2">{t("meetings.title")}</h2>

            {meetings.length === 0 && (
                <p className="text-gray-500 italic">{t("meetings.noneFound")}</p>
            )}

            {meetings
                .toSorted(
                    (a, b) =>
                        new Date(a.startAt).getTime() -
                        new Date(b.startAt).getTime()
                )
                .map((meeting) => (
                    <div
                        key={meeting.id}
                        className="border-b border-gray-200 py-4 last:border-b-0"
                    >
                        <p><strong>{t("meetings.start")}</strong> {new Date(meeting.startAt).toLocaleString()}</p>
                        <p><strong>{t("meetings.end")}</strong> {new Date(meeting.endAt).toLocaleString()}</p>
                        <p><strong>{t("meetings.location")}</strong> {meeting.location}</p>
                        <p><strong>{t("meetings.status")}</strong> {meeting.meetingStatus}</p>

                    </div>
                ))}
        </div>
    );
};

export default MeetingComponent;
