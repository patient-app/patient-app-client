"use client";

import { LoginPatientDTO } from "@/dto/input/LoginPatientDTO";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
        headers: { "Content-Type": "application/json" },
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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      {" "}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          gap: "20px",
          padding: "20px",
        }}
      >
        <h1 style={{ fontSize: "32px" }}> Welcome to the Patient App</h1>
        <h4 style={{ fontSize: "28px" }}>Login</h4>

        <form style={{ display: "flex", width: "100%", justifyContent: "center", gap: "10px" }} onSubmit={handleLogin}>
          <input
            style={{ border: "3px solid black" }}
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            style={{ border: "3px solid black" }}
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {error && <p>{error}</p>}
          <button style={{ padding: "5px", background: "grey", cursor: "pointer" }} type="submit">
            Login
          </button>
        </form>
        <div style={{ display: "flex", width: "100%", justifyContent: "center" }}>
          <button
            style={{ padding: "5px", background: "grey", cursor: "pointer" }}
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
