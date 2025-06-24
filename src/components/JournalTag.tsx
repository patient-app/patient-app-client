import { X } from "lucide-react";
import React from "react";

interface JournalTagProps {
    label: string;
    onRemove?: () => void;
}

export const JournalTag: React.FC<JournalTagProps> = ({ label, onRemove }) => {
    return (
        <div className="inline-flex items-center px-3 py-1 bg-gray-200 text-gray-800 text-sm rounded-full">
            <span>{label}</span>
            {onRemove && (
                <button
                    onClick={onRemove}
                    className="ml-2 text-gray-500 hover:text-red-600"
                    type="button"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    );
};
