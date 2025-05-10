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
                const errorData = await response.json();
                setError(("Failed to login: " + errorData.message) || "Failed to login, please try again.");
            } else {
                router.push("/");
            }
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
            <div className="min-h-screen w-full flex flex-col items-center justify-start pt-18">
                <h2 className="text-2xl font-medium mb-3">Welcome back</h2>

                <form onSubmit={handleLogin} className="flex flex-col items-center gap-4 w-full" style={{ maxWidth: "20rem" }}>
                    <div className="flex flex-col gap-2 w-full">
                        <label className="font-semibold" htmlFor="email">Email Address</label>
                        <input
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-emerald-600"
                            name="email"
                            type="email"
                            id="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                        <label className="font-semibold" htmlFor="password">Password</label>
                        <input
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-emerald-600"
                            name="password"
                            type="password"
                            id="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />

                        <div className="flex gap-1 items-center text-base mt-2">
                            <span>Forgot password?</span>
                            <a href="/reset-password" className="text-emerald-600 hover:underline cursor-pointer">Reset</a>
                        </div>

                        <button className="w-full mt-3 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition cursor-pointer"
                                type="submit" color="primary">
                            Login
                        </button>

                        {error && (
                            <div className="w-full mt-2 px-4 py-2 bg-red-100 text-red-700 border border-red-300 rounded-md text-sm">
                                {error}
                            </div>
                        )}

                        <div className="flex gap-1 items-center text-base mt-2">
                            <span>Don&apos;t have an account?</span>
                            <a href="/register" className="text-emerald-600 hover:underline cursor-pointer">Register</a>
                        </div>


                    </div>
                </form>
            </div>
        </>
    );
};

export default Login;
