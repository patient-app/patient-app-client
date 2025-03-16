"use client";

import { RegisterPatientDTO } from "@/dto/input/RegisterPatientDTO";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
        headers: { "Content-Type": "application/json" },
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
        <h2 style={{ fontSize: "28px" }}>Register</h2>

        <form
          style={{ display: "flex", width: "100%", justifyContent: "center", gap: "10px" }}
          onSubmit={handleRegister}
        >
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
          <button style={{ padding: "5px", background: "grey", cursor: "pointer" }} type="submit" color="primary">
            Register
          </button>
        </form>
        <div style={{ display: "flex", width: "100%", justifyContent: "center" }}>
          <button
            style={{ padding: "5px", background: "grey", cursor: "pointer" }}
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
