"use client";

import {PatientOutputDTO} from "@/dto/output/PatientOutputDTO";
import {useRouter} from "next/navigation";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import MeetingComponent from "@/components/MeetingComponent";
import {Bell, BookPlus, CircleArrowRight, MessageSquarePlus, Play, Save} from "lucide-react";
import {JournalEntryDTO} from "@/dto/output/JournalEntryDTO";
import {BASE_PATH} from "@/libs/constants";
import {sendNotification, subscribeUser} from "@/app/actions";

const tile_class = "w-full lg:w-[calc(50%-0.5rem)] border border-gray-300 shadow-md bg-white p-4 rounded-md mb-4 h-[250px] flex flex-col";
const header_class = "text-xl font-semibold mb-2";

function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
}

function PushNotificationManager() {
    const [isSupported, setIsSupported] = useState(false);
    const [subscription, setSubscription] = useState<PushSubscription | null>(null);
    const [testMessage, setTestMessage] = useState<string>("Test notification message");
    const [sendingStatus, setSendingStatus] = useState<string>("");

    useEffect(() => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            setIsSupported(true);
            registerServiceWorker();
        }
    }, []);

    async function registerServiceWorker() {
        try {
            console.log('Registering service worker...');
            const registration = await navigator.serviceWorker.register('/sw.js', {
                scope: '/',
                updateViaCache: 'none',
            });
            console.log('Service worker registered successfully:', registration);

            // Check if service worker is active
            if (registration.active) {
                console.log('Service worker is active');
            } else {
                console.log('Service worker is not active yet');
            }

            // Get existing subscription if any
            const sub = await registration.pushManager.getSubscription();
            console.log('Existing push subscription:', sub);
            setSubscription(sub);

            // Log service worker state changes
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                console.log('Service worker controller changed');
            });

            return registration;
        } catch (error) {
            console.error('Error registering service worker:', error);
            throw error;
        }
    }

    async function subscribeToPush() {
        try {
            console.log('Waiting for service worker to be ready...');
            const registration = await navigator.serviceWorker.ready;
            console.log('Service worker is ready:', registration);

            console.log('VAPID public key:', process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY);

            // NEW

            // Get VAPID public key from environment variable
            const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
            if (!vapidPublicKey) {
                throw new Error('VAPID public key is not defined in environment variables');
            }

            console.log('Using VAPID public key:', vapidPublicKey);

            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
            });
            setSubscription(subscription);
            const subscriptionJSON: PushSubscriptionJSON = subscription.toJSON();

            // Log the final subscription object before sending to backend
            console.log('Final subscription object:', JSON.stringify(subscriptionJSON, null, 2));
            const result = await subscribeUser(subscriptionJSON);

            console.log('Subscription sent to backend, result:', result);

            if (!result.success) {
                throw new Error(result.error || 'Failed to subscribe to push notifications');
            }

            return subscription;
        } catch (error) {
            console.error('Error subscribing to push notifications:', error);
            throw error;
        }
    }

    async function sendNotificationClientSide(message: string) {
        try {
            console.log('Sending notification with message:', message);

            // Use the server action to send the notification
            const result = await sendNotification(message);

            console.log('Notification result:', result);

            return result;
        } catch (error) {
            console.error('Error sending push notification:', error);
            return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
        }
    }

    async function handleSendTestNotification() {
        try {
            setSendingStatus("Sending notification...");
            console.log('Sending test notification with message:', testMessage);
            const result = await sendNotificationClientSide(testMessage);
            console.log('Test notification result:', result);

            if (result.success) {
                setSendingStatus("Notification sent successfully! Check your browser notifications.");
            } else {
                setSendingStatus(`Failed to send notification: ${result.error}`);
            }
        } catch (error) {
            console.error('Error sending test notification:', error);
            setSendingStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    if (!isSupported) {
        return <div className="mb-3 px-4 py-2 bg-red-300 text-black border border-red-500 rounded-md text-sm">
            Push notifications are not supported in your browser.
        </div>
    }

    return (
        <div className="border border-gray-300 rounded-md p-4 mb-4 w-full">
            <h3 className="text-lg font-semibold mb-2">Push Notification Manager</h3>

            {subscription ? (
                <div className="mb-3 px-4 py-2 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-md text-sm">
                    You are subscribed to push notifications.
                </div>
            ) : (
                <div className="mb-3 px-4 py-2 bg-yellow-100 text-yellow-800 border border-yellow-300 rounded-md text-sm">
                    You are not subscribed to push notifications.
                </div>
            )}

            <div className="flex flex-col gap-3">
                {!subscription && (
                    <button
                        onClick={subscribeToPush}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition flex items-center justify-center gap-2"
                    >
                        Subscribe to Push Notifications
                    </button>
                )}

                {subscription && (
                    <div className="border border-gray-200 rounded-md p-3">
                        <h4 className="font-medium mb-2">Test Push Notification</h4>
                        <div className="flex flex-col gap-2">
                            <input
                                type="text"
                                value={testMessage}
                                onChange={(e) => setTestMessage(e.target.value)}
                                placeholder="Enter test message"
                                className="border border-gray-300 rounded px-3 py-2"
                            />
                            <button
                                onClick={handleSendTestNotification}
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition flex items-center justify-center gap-2"
                            >
                                Send Test Notification <Bell size={16} />
                            </button>

                            {sendingStatus && (
                                <div className={`mt-2 px-3 py-2 rounded text-sm ${
                                    sendingStatus.includes("successfully")
                                        ? "bg-green-100 text-green-800 border border-green-300"
                                        : sendingStatus.includes("Failed") || sendingStatus.includes("Error")
                                            ? "bg-red-100 text-red-800 border border-red-300"
                                            : "bg-blue-100 text-blue-800 border border-blue-300"
                                }`}>
                                    {sendingStatus}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <button
                onClick={subscribeToPush}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition flex items-center justify-center gap-2"
            >
                Subscribe to Push Notifications ANYWAYS
            </button>
            <button
                onClick={handleSendTestNotification}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition flex items-center justify-center gap-2"
            >
                Send Test Notification ANYWAYS <Bell size={16} />
            </button>
        </div>
    )
}

export default function Home() {
    const router = useRouter();
    const {t, i18n} = useTranslation();

    const [mePatient, setMePatient] = useState<PatientOutputDTO>();

    const [lastChatId, setLastChatId] = useState<string | null>(null);
    const [lastChatName, setLastChatName] = useState<string | null>(null);

    const [journalEntries, setJournalEntries] = useState<JournalEntryDTO[]>([]);
    const [lastJournalText, setLastJournalText] = useState<string>("");

    const [quickJournalContent, setQuickJournalContent] = useState<string>("");

    interface ExerciseDTO {
        id: string;
        exerciseTitle: string;
        exerciseDescription: string;
    }

    const [exercises, setExercises] = useState<ExerciseDTO[]>([])

    useEffect(() => {
        const fetchMyself = async () => {
            try {
                const requestInit: RequestInit = {
                    method: "GET",
                    credentials: "include",
                };
                const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/patients/me", requestInit);
                if (!response.ok) {
                    console.warn("Failed to fetch patient data");
                    router.push("/login");
                } else {
                    const patient_response = await response.json();

                    if (!patient_response.onboarded && window.location.pathname !== "/onboarding") {
                        console.log("Patient is not onboarded, redirecting to onboarding.");
                        router.push("/onboarding");
                        return;
                    }

                    setMePatient(patient_response);
                    console.log("Patient data fetched successfully", patient_response);
                    localStorage.setItem('lang', patient_response.language);
                    await i18n.changeLanguage(patient_response.language);
                }
            } catch (e) {
                console.error(e);
                router.push("/login");
            }

            // Fetch last chat if available
            try {
                const requestInit: RequestInit = {
                    method: "GET",
                    credentials: "include",
                };
                const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/patients/conversations", requestInit);
                if (!response.ok) {
                    console.warn("Failed to fetch data");
                    return;
                }

                const respo = await response.json();
                console.log(respo);
                if (respo.length > 0) {
                    const last = respo[respo.length - 1];
                    setLastChatId(last.id);
                    setLastChatName(last.name);
                }
                console.log("Conversations fetched successfully", respo);
            } catch (e) {
                console.error(e);
                return;
            }
        };
        fetchMyself();
    }, [i18n, router]);

    useEffect(() => {
        const fetchJournalEntries = async () => {
            try {
                const requestInit: RequestInit = {
                    method: "GET",
                    credentials: "include"
                };
                const response = await fetch(
                    process.env.NEXT_PUBLIC_BACKEND_URL + "/patients/journal-entries",
                    requestInit
                );
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error("Failed to fetch journal entries:", errorData.message);
                } else {
                    const journalResponse = await response.json();
                    setJournalEntries(journalResponse);

                    if (journalResponse.length > 0) {
                        const requestInit2: RequestInit = {
                            method: "GET",
                            credentials: "include"
                        };
                        const lastResponse = await fetch(
                            process.env.NEXT_PUBLIC_BACKEND_URL + "/patients/journal-entries/" + journalResponse[0].id,
                            requestInit2
                        );
                        if (!lastResponse.ok) {
                            const errorData = await response.json();
                            console.error("Failed to fetch last journal entry:", errorData.message);
                            return;
                        }
                        const lastJournalResponse = await lastResponse.json();
                        setLastJournalText(lastJournalResponse.content);
                    }
                }
            } catch (e) {
                console.error("Failed to fetch journal entries:", e);
            }
        };
        fetchJournalEntries();
    }, []);

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const requestInit: RequestInit = {
                    method: "GET",
                    credentials: "include"
                };
                const response = await fetch(
                    process.env.NEXT_PUBLIC_BACKEND_URL + "/patients/exercises",
                    requestInit
                );
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error("Failed to fetch exercises:", errorData.message);
                    return;
                }

                const exerciseResponse = await response.json();
                setExercises(exerciseResponse);

            } catch (e) {
                console.error("Failed to fetch journal entries:", e);
            }
        }
        fetchExercises();
    }, []);

    const saveQuickJournal = async () => {
        if (quickJournalContent.trim().length === 0) return;

        try {
            const requestInit: RequestInit = {
                method: "POST",
                credentials: "include",
                body: JSON.stringify({
                    "title": t("home.quickJournal.title"),
                    "content": quickJournalContent,
                    "tags": ["QuickJournal"],
                    "sharedWithTherapist": false
                }),
                headers: {"Content-Type": "application/json"},
            };
            const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/patients/journal-entries", requestInit);
            if (response.status !== 201) {
                const errorData = await response.json();
                console.log(errorData)
                alert((t("journalCreationEditing.error.savingFailed") + errorData.message) || t("journalCreationEditing.error.savingTryAgain"));
                return;
            }

            console.log("Quick Journal saved successfully");
            router.push("/journal");

        } catch (e) {
            console.error("Failed to save the journal entry: ", e);
        }

    }

    return (
        <main className="flex flex-col items-center justify-center w-full gap-5 p-5">
            <h1 className="text-3xl font-semibold">{t("home.title")}</h1>

            <PushNotificationManager />

            <MeetingComponent/>

            {/* Tile Layout */}
            <div className="w-[90%] lg:w-[65%] flex flex-row flex-wrap items-start justify-center gap-4">

                {/* Tile: Your Information */}
                <div className={tile_class}>
                    <h2 className={header_class}>{mePatient?.name ? `${t("home.welcome")}, ${mePatient.name}!` : t("home.title")}</h2>
                    <div className="flex-grow flex flex-col gap-2">
                        <p><strong>{t("home.yourInformation.name")}</strong> {mePatient?.name || "unknown"}</p>
                        <p><strong>{t("home.yourInformation.email")}</strong> {mePatient?.email || "unknown"}</p>
                        <p>
                            <strong>{t("home.yourInformation.language")}</strong>{" "}
                            {mePatient?.language === "en"
                                ? "English"
                                : mePatient?.language === "de"
                                    ? "German"
                                    : mePatient?.language === "uk"
                                        ? "Ukrainian"
                                        : mePatient?.language || "unknown"}
                        </p>
                        <p>
                            <strong>{t("home.yourInformation.avatar")}</strong> {mePatient?.chatBotAvatar ? mePatient.chatBotAvatar.charAt(0).toUpperCase() + mePatient.chatBotAvatar.slice(1).toLowerCase() : "unknown"}
                        </p>
                        <p><strong>{t("home.yourInformation.id")}</strong> {mePatient?.id || "unknown"}</p>
                    </div>
                </div>

                {/* Tile: Last Conversation */}
                <div className={tile_class}>
                    <h2 className={header_class}>{t("home.lastChat")}</h2>
                    <div className="flex-grow">
                        {lastChatId ?
                            <div
                                className="border border-gray-300 rounded-md p-3 flex flex-row items-center justify-between">
                                <p className="font-bold">{lastChatName ? lastChatName : t("chats.unnamedConversation")}</p>
                                <button
                                    onClick={() => router.push(`/chats/${lastChatId}`)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition flex items-center gap-2 cursor-pointer"
                                >
                                    {t("home.continueConversation")} <CircleArrowRight size={20} strokeWidth={2}/>
                                </button>
                            </div>
                            :
                            <p className="italic text-gray-500">{t("home.noConversationsYet")}</p>
                        }
                    </div>
                    <button
                        onClick={() => router.push('/chat')}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition flex items-center justify-center gap-2 cursor-pointer mt-auto"
                    >
                        {t("home.startNewConversation")} <MessageSquarePlus size={20} strokeWidth={2}/>
                    </button>
                </div>

                {/* Tile: Quick Journal */}
                <div className={tile_class}>
                    <h2 className={header_class}>{t("home.quickJournal.title")}</h2>
                    <div className="flex-grow flex flex-col gap-2">

                        <textarea
                            placeholder={t("home.quickJournal.placeholder")}
                            value={quickJournalContent}
                            onChange={e => setQuickJournalContent(e.target.value)}
                            className="w-full h-[100%] bg-transparent outline-none placeholder-gray-400 resize-none text-base"
                        />

                        <button
                            onClick={() => saveQuickJournal()}
                            className={
                                "bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition flex items-center justify-center gap-2 mt-auto" +
                                (quickJournalContent.trim().length === 0 ? " opacity-50 cursor-default" : " cursor-pointer")
                            }
                            disabled={quickJournalContent.trim().length === 0}
                        >
                            {t("home.quickJournal.save")} <Save size={20} strokeWidth={2}/>
                        </button>
                    </div>
                </div>

                {/* Tile: Last Journal */}
                <div className={tile_class}>
                    <h2 className={header_class}>{t("home.lastJournal.title")}</h2>
                    <div className="flex-grow flex flex-col gap-2">

                        {journalEntries.length > 0 ?
                            <div className="border border-gray-300 rounded-md p-3 flex flex-col items-center">
                                <p className="font-bold">{journalEntries[0].title ? journalEntries[0].title : t("home.lastJournal.unnamedJournal")}</p>
                                <p className="italic text-gray-400 text-sm text-center">{lastJournalText ? lastJournalText.slice(0, 30) + "..." : t("home.lastJournal.emptyJournal")}</p>
                                <button
                                    onClick={() => router.push(`/journal/${journalEntries[0].id}`)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition flex items-center justify-center gap-2 cursor-pointer mt-2"
                                >
                                    {t("home.lastJournal.openLast")} <CircleArrowRight size={20} strokeWidth={2}/>
                                </button>
                            </div>
                            :
                            <p className="italic text-gray-500">{t("home.lastJournal.noEntriesYet")}</p>
                        }
                    </div>
                    <button
                        onClick={() => router.push('/journal/creation')}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition flex items-center justify-center gap-2 cursor-pointer mt-auto"
                    >
                        {t("home.lastJournal.newEntry")} <BookPlus size={20} strokeWidth={2}/>
                    </button>
                </div>

                {/* Tile: Exercises */}
                <div className={tile_class}>
                    <h2 className={header_class}>{t("home.exercises.title")}</h2>
                    <div className="flex-grow flex flex-col mb-1 overflow-y-auto gap-2">
                        {exercises.length > 0 ? (
                            exercises.map((exercise) => (
                                <div key={exercise.id}
                                     className="border border-gray-300 rounded-md p-3 flex flex-row items-center justify-between">
                                    <p className="font-bold">{exercise.exerciseTitle ? exercise.exerciseTitle : t("home.exercises.unnamedExercise")}</p>
                                    <button
                                        onClick={() => router.push("/exercise/" + exercise.id)}
                                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition flex items-center gap-2 cursor-pointer"
                                    >
                                        {t("home.exercises.open")} <Play size={16}/>
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="italic text-gray-500">{t("home.exercises.noExercises")}</p>
                        )}
                    </div>
                    <button
                        onClick={() => router.push('/exercise')}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition flex items-center justify-center gap-2 cursor-pointer mt-auto"
                    >
                        {t("home.exercises.showAll")} <CircleArrowRight size={20} strokeWidth={2}/>
                    </button>
                </div>

                {/* Tile: Questionnaires */}
                <div className={tile_class}>
                    <h2 className={header_class}>{t("home.questionnaires.title")}</h2>
                    <div className="flex-grow flex flex-col gap-2">

                        <div
                            className="w-full max-w-xl border border-gray-300 shadow-md bg-white p-4 rounded-md mb-4 flex justify-between items-center hover:bg-gray-50 transition"
                        >
                            <div>
                                <p className="font-bold text-lg">{t("questionnaires.GAD-7.title")}</p>
                                <p className="text-sm text-gray-500">{t("questionnaires.GAD-7.explanation")}</p>
                            </div>
                            <button
                                onClick={() => router.push("/questionnaires/GAD-7")}
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition flex items-center gap-2 cursor-pointer"
                            >
                                Start <Play size={16}/>
                            </button>
                        </div>
                        <button
                            onClick={() => router.push('/questionnaires')}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition flex items-center justify-center gap-2 cursor-pointer mt-auto"
                        >
                            {t("home.questionnaires.showAll")} <CircleArrowRight size={20} strokeWidth={2}/>
                        </button>
                    </div>
                </div>

                <div
                    className="text-sm text-gray-600 flex gap-2 justify-center">
                    <a href={`${BASE_PATH}/terms`} target="_blank"
                       className="text-emerald-600 hover:underline">{t("footer.terms")}</a>
                </div>

            </div>

        </main>
    );
}