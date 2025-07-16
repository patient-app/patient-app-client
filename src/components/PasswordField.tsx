"use client";

import React from "react";
import {Eye, EyeOff} from "lucide-react";

interface PasswordFieldProps {
    id: string;
    value: string;
    placeholder: string;
    show: boolean;
    toggle: () => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const eyeIcon = <Eye size={24} strokeWidth={2} />;
const eyeOffIcon = <EyeOff size={24} strokeWidth={2} />;

const PasswordField: React.FC<PasswordFieldProps> = ({
                                                         id,
                                                         value,
                                                         placeholder,
                                                         show,
                                                         toggle,
                                                         onChange,
                                                     }) => {
    return (
        <div className="relative">
            <input
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-emerald-600"
                name={id}
                type={show ? "text" : "password"}
                id={id}
                value={value}
                placeholder={placeholder}
                onChange={onChange}
                required
            />
            <button
                type="button"
                onClick={toggle}
                className="absolute right-3 top-2"
                aria-label="Toggle password visibility"
            >
                {show ? eyeOffIcon : eyeIcon}
            </button>
        </div>
    );
};

export default PasswordField;