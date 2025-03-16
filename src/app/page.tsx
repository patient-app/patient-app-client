"use client";

import { PatientOutputDTO } from "@/dto/output/PatientOutputDTO";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();

  const [mePatient, setMePatient] = useState<PatientOutputDTO>({
    id: "",
    email: "",
  });

  const logout = async () => {
    const requestInit: RequestInit = {
      method: "POST",
      credentials: "include",
    };
    fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/patients/logout", requestInit);
    router.push("/login");
  };

  useEffect(() => {
    const fetchMyself = async () => {
      try {
        const requestInit: RequestInit = {
          method: "GET",
          credentials: "include",
        };
        const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/patients/me", requestInit);
        if (!response.ok) {
          throw new Error("Failed to fetch patient data");
        }
        setMePatient(await response.json());
      } catch (e) {
        console.error(e);
        router.push("/register");
      }
    };
    fetchMyself();
  }, []);

  return (
    <main
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
      <h1 style={{ fontSize: "32px" }}>Welcome to the Patient App</h1>
      {mePatient.email ? <p>You are logged in as: {mePatient.email}</p> : <div>Something went wrong</div>}
      <button style={{ padding: "5px", background: "grey", cursor: "pointer" }} onClick={logout}>
        Logout
      </button>
    </main>
  );
}
