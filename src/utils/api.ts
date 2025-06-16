import axios from "axios";
import { ConversationControllerApiFactory, PatientControllerApiFactory } from "../api";

const baseURL: string = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8080";

const api = axios.create({
  baseURL: baseURL,
  timeout: 60000,
  withCredentials: true,
});

export const conversationControllerApi = ConversationControllerApiFactory(undefined, baseURL, api);
export const patientControllerApi = PatientControllerApiFactory(undefined, baseURL, api);
