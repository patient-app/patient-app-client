"use client";

import {useRef, useEffect, useState} from "react";

interface TagSelectorProps {
    tags: string[];
    setTagsAction: React.Dispatch<React.SetStateAction<string[]>>;
    fetchedTags: string[];
    tAction: (key: string) => string;
}

export const TagSelector: React.FC<TagSelectorProps> = ({
                                                            tags,
                                                            setTagsAction,
                                                            fetchedTags,
                                                            tAction,
                                                        }) => {
    const [tagInput, setTagInput] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleTagAdd = (tag: string) => {
        const trimmed = tag.trim();
        if (trimmed && !tags.includes(trimmed)) {
            setTagsAction((prev) => [...prev, trimmed]);
        }
        setTagInput("");
        setShowDropdown(false);
    };

    const filteredTags = fetchedTags.filter(
        (tag) =>
            tag.toLowerCase().includes(tagInput.toLowerCase()) &&
            !tags.includes(tag)
    );

    return (
        <div ref={dropdownRef} className="relative w-full max-w-sm">
            <input
                type="text"
                value={tagInput}
                onFocus={() => setShowDropdown(true)}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        handleTagAdd(tagInput);
                    }
                }}
                placeholder={tAction("Search or create tag")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {showDropdown && (
                <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-auto">
                    {filteredTags.length > 0 ? (
                        filteredTags.map((tag) => (
                            <li key={tag}>
                                <button
                                    type="button"
                                    onClick={() => handleTagAdd(tag)}
                                    className="w-full text-left px-3 py-2 hover:bg-gray-100"
                                >
                                    {tag}
                                </button>
                            </li>
                        ))
                    ) : (
                        !fetchedTags.concat(tags).some(
                            (tag) =>
                                tag.toLowerCase() === tagInput.toLowerCase()
                        ) && tagInput.trim() !== "" && (
                            <li>
                                <button
                                    type="button"
                                    onClick={() => handleTagAdd(tagInput)}
                                    className="w-full text-left px-3 py-2 text-blue-600 hover:bg-blue-50"
                                >
                                    {tAction("Create tag")}:{" "}
                                    <strong>{tagInput}</strong>
                                </button>
                            </li>
                        )
                    )}
                </ul>
            )}
        </div>
    );
};
