"use client";

import {LoginPatientDTO} from "@/dto/input/LoginPatientDTO";
import {useRouter} from "next/navigation";
import {useState} from "react";

const Login = () => {
    const router = useRouter();

    const [formData, setFormData] = useState<LoginPatientDTO>({
        email: "",
        password: "",
    });
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
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
            const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/patients/login", requestInit);
            if (!response.ok) {
                throw new Error("Failed to login");
            }
            router.push("/");
        } catch (e) {
            setError(`Failed to login, please try again`);
            console.error("Failed to login", e);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    return (
        <>
            {" "}
            <div className={"flex flex-col items-center justify-center w-full gap-6 p-6"}>
                <h1 className="text-3xl font-semibold"> Welcome to the Patient App</h1>
                <h4 className="text-2xl font-medium">Login</h4>

                <form className="flex flex-col md:flex-row items-center gap-4 w-full max-w-md" onSubmit={handleLogin}>
                    <input
                        className="w-full px-4 py-2 border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        className="w-full px-4 py-2 border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    {error && <p>{error}</p>}
                    <button className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition"
                            type="submit">
                        Login
                    </button>
                </form>
                <div className="w-full flex justify-center">
                    <button
                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
                        onClick={() => router.push("/register")}
                    >
                        Go to Registration
                    </button>
                </div>
            </div>
        </>
    );
};

export default Login;
