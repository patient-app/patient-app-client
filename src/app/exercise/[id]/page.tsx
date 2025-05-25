"use client";

import {useParams} from "next/navigation";
import {useState, useRef, useEffect} from "react";

const ExerciseDetailPage = () => {
    const params = useParams();
    const id = params?.id;

    const [isHelpVisible, setIsHelpVisible] = useState(false);
    const helpRef = useRef(null);

    const toggleHelpVisibility = () => {
        setIsHelpVisible(!isHelpVisible);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (helpRef.current && !(helpRef.current as HTMLElement).contains(event.target as Node)) {
                setIsHelpVisible(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Exercise {id}</h1>

            <div className="fixed right-4 bottom-25 desktop:bottom-10 desktop:right-10"
                 ref={helpRef}>
                <div>
                    {isHelpVisible && (
                        <div className="flex flex-col items-center mb-1">
                            {/* Chatbot button */}
                            <button
                                className="w-15 h-15 bg-gray-figma rounded-xl flex items-center justify-center hover:bg-neutral-800 transition cursor-pointer">
                                <svg width="44" height="36" viewBox="0 0 44 36" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22 10V2H14" stroke="white" strokeWidth="4" strokeLinecap="round"
                                          strokeLinejoin="round"/>
                                    <path
                                        d="M34 10H10C7.79086 10 6 11.7909 6 14V30C6 32.2091 7.79086 34 10 34H34C36.2091 34 38 32.2091 38 30V14C38 11.7909 36.2091 10 34 10Z"
                                        stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M2 22H6M38 22H42M28 20V24M16 20V24" stroke="white" strokeWidth="4"
                                          strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>

                            {/* Document button */}
                            <button
                                className="w-15 h-15 bg-gray-figma rounded-xl flex items-center justify-center hover:bg-neutral-800 transition cursor-pointer">
                                <svg width="32" height="40" viewBox="0 0 32 40" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M0 4C0 2.93913 0.421427 1.92172 1.17157 1.17157C1.92172 0.421427 2.93913 0 4 0H20C20.5304 0.000113275 21.039 0.210901 21.414 0.586L31.414 10.586C31.7891 10.961 31.9999 11.4696 32 12V36C32 37.0609 31.5786 38.0783 30.8284 38.8284C30.0783 39.5786 29.0609 40 28 40H4C2.93913 40 1.92172 39.5786 1.17157 38.8284C0.421427 38.0783 0 37.0609 0 36V4ZM27.172 12L20 4.828V12H27.172ZM16 4H4V36H28V16H18C17.4696 16 16.9609 15.7893 16.5858 15.4142C16.2107 15.0391 16 14.5304 16 14V4ZM8 22C8 21.4696 8.21071 20.9609 8.58579 20.5858C8.96086 20.2107 9.46957 20 10 20H22C22.5304 20 23.0391 20.2107 23.4142 20.5858C23.7893 20.9609 24 21.4696 24 22C24 22.5304 23.7893 23.0391 23.4142 23.4142C23.0391 23.7893 22.5304 24 22 24H10C9.46957 24 8.96086 23.7893 8.58579 23.4142C8.21071 23.0391 8 22.5304 8 22ZM8 30C8 29.4696 8.21071 28.9609 8.58579 28.5858C8.96086 28.2107 9.46957 28 10 28H22C22.5304 28 23.0391 28.2107 23.4142 28.5858C23.7893 28.9609 24 29.4696 24 30C24 30.5304 23.7893 31.0391 23.4142 31.4142C23.0391 31.7893 22.5304 32 22 32H10C9.46957 32 8.96086 31.7893 8.58579 31.4142C8.21071 31.0391 8 30.5304 8 30Z"
                                        fill="white"/>
                                </svg>


                            </button>
                        </div>
                    )}
                    {/* Question mark button */}
                    <button
                        className="w-15 h-15 bg-gray-figma shadow-md rounded-full flex items-center justify-center hover:bg-neutral-800 transition cursor-pointer"
                        onClick={() => toggleHelpVisibility()}>
                        <svg width="22" height="40" viewBox="0 0 22 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15.9951 10.6842C15.9951 9.17543 15.495 7.9649 14.4949 7.05262C13.4948 6.14034 12.1688 5.6842 10.5169 5.6842C9.49849 5.6842 8.57702 5.90385 7.75249 6.34315C6.92795 6.78245 6.21649 7.42245 5.6181 8.26315C5.05623 9.07016 4.2921 9.53542 3.32569 9.65893C2.35928 9.78244 1.52561 9.52771 0.824683 8.89472C0.33305 8.43858 0.0612474 7.87718 0.00927485 7.21052C-0.0426977 6.54385 0.123755 5.91227 0.508633 5.31578C1.63236 3.63157 3.06372 2.32491 4.80269 1.39579C6.54167 0.466666 8.44639 0.00140351 10.5169 0C13.9232 0 16.689 0.964911 18.8142 2.89473C20.9395 4.82455 22.0014 7.35087 22 10.4737C22 12.0526 21.6664 13.4737 20.9992 14.7368C20.332 16 19.1029 17.4912 17.3119 19.2105C16.0126 20.4386 15.1347 21.3951 14.6782 22.08C14.2217 22.7649 13.9232 23.5452 13.7827 24.421C13.6422 25.2631 13.2819 25.9649 12.7018 26.5263C12.1217 27.0877 11.4285 27.3684 10.6222 27.3684C9.81594 27.3684 9.12274 27.0968 8.54261 26.5536C7.96248 26.0105 7.67242 25.3347 7.67242 24.5263C7.67242 23.1579 7.97091 21.9038 8.56789 20.7642C9.16488 19.6245 10.1657 18.4224 11.5704 17.1579C13.3613 15.5789 14.5468 14.36 15.127 13.501C15.7071 12.6421 15.9965 11.7031 15.9951 10.6842ZM10.5169 39.9999C9.35802 39.9999 8.36633 39.588 7.54179 38.7642C6.71725 37.9403 6.30428 36.9487 6.30287 35.7894C6.30147 34.6301 6.71444 33.6392 7.54179 32.8168C8.36914 31.9943 9.36083 31.5817 10.5169 31.5789C11.6729 31.5761 12.6653 31.9887 13.4941 32.8168C14.3228 33.6449 14.7351 34.6357 14.7309 35.7894C14.7266 36.9431 14.3144 37.9347 13.4941 38.7642C12.6737 39.5936 11.6813 40.0056 10.5169 39.9999Z" fill="white"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExerciseDetailPage;
