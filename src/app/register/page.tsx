"use client";

import { RegisterPatientDTO } from "@/dto/input/RegisterPatientDTO";
import { useRouter } from "next/router";
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
      await await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/register");
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
          width: "100%",
          gap: "32px",
        }}
      >
        <h2> Welcome to the Patient App</h2>
        <h4>Register</h4>
      </div>
      <div>
        <form onSubmit={handleRegister}>
          <input name="email" type="email" value={formData.email} onChange={handleChange} required />
          <input name="password" type="password" value={formData.password} onChange={handleChange} required />
          {error && <p>{error}</p>}
          <button type="submit" color="primary">
            Login
          </button>
        </form>
      </div>
      <div style={{ display: "flex", width: "100%", marginTop: "32px", justifyContent: "center" }}>
        <button onClick={() => router.push("/login")}>Go to Login</button>
      </div>
    </>
  );
};

export default Register;
