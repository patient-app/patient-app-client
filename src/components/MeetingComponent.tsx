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

    const upcomingMeetings = meetings
        .filter(meeting => new Date(meeting.endAt) > new Date())
        .toSorted((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime())

    return (
        <div className="w-full lg:w-[calc(50%-0.5rem)] border border-gray-300 shadow-md bg-white p-4 rounded-md mb-4 flex flex-col h-[250px]">
            <h2 className="text-xl font-semibold mb-2">{t("meetings.title")}</h2>

            {upcomingMeetings.length === 0 ? (
                <p className="text-gray-500 italic">{t("meetings.noneFound")}</p>
            ) : (
                <div className="overflow-y-auto space-y-4 pr-2">
                    {upcomingMeetings.map((meeting) => (
                        <div
                            key={meeting.id}
                            className="border-b border-gray-200 pb-2 last:border-b-0"
                        >
                            <p>
                                <strong>{t("meetings.start")} </strong>
                                {new Date(meeting.startAt).toLocaleString("de-CH", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false,
                                })}
                            </p>
                            <p>
                                <strong>{t("meetings.end")} </strong>
                                {new Date(meeting.endAt).toLocaleString("de-CH", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false,
                                })}
                            </p>
                            <p>
                                <strong>{t("meetings.location")}</strong>{" "}
                                {meeting.location.startsWith("http") ||
                                meeting.location.startsWith("www.") ? (
                                    <a
                                        href={meeting.location}
                                        className="text-blue-600 underline break-words"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {meeting.location}
                                    </a>
                                ) : (
                                    meeting.location
                                )}
                            </p>
                            <p>
                                <strong>{t("meetings.status")}</strong>{" "}
                                {meeting.meetingStatus.charAt(0).toUpperCase() +
                                    meeting.meetingStatus.slice(1).toLowerCase()}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>

    );
};

export default MeetingComponent;
