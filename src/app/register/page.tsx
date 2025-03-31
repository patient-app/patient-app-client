"use client";

import {RegisterPatientDTO} from "@/dto/input/RegisterPatientDTO";
import {useRouter} from "next/navigation";
import {useState} from "react";

const Register = () => {
    const router = useRouter();

    const [formData, setFormData] = useState<RegisterPatientDTO>({
        email: "",
        password: "",
    });
    const [error, setError] = useState<string | null>(null);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!formData.email || !formData.password) {
            setError("Both fields are required.");
            return;
        }
        try {
            const requestInit: RequestInit = {
                method: "POST",
                credentials: "include",
                body: JSON.stringify(formData),
                headers: {"Content-Type": "application/json"},
            };
            const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/patients/register", requestInit);
            if (!response.ok) {
                throw new Error("Failed to register");
            }
            router.push("/");
        } catch (e) {
            setError(`Failed to register, please try again`);
            console.error("Failed to register", e);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    return (
        <>
            {" "}
            <div className="flex flex-col items-center justify-center w-full gap-6 p-4">
                <h1 className="text-3xl font-semibold text-center">Welcome to the Patient App</h1>
                <h2 className="text-2xl font-medium">Register</h2>

                <form onSubmit={handleRegister} className="flex flex-col md:flex-row items-center md:items-end gap-4 w-full max-w-md"
                >
                    <div className="flex flex-col gap-1">
                        <label className="font-semibold">Username</label>
                        <input
                            className="w-full px-4 py-2 border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-green-200"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="font-semibold">Password</label>
                        <input
                            className="w-full px-4 py-2 border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-green-200"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {error && <p>{error}</p>}
                    <button className="mt-2 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition"
                            type="submit" color="primary"> Register
                    </button>
                </form>
                <div className="w-full flex justify-center">
                    <button
                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
                        onClick={() => router.push("/login")}
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        </>
    );
};

export default Register;
