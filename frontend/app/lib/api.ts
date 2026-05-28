import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 60000,
});

export const getAssignments = () => API.get("/assignments");

export const getAssignment = (id: string) => API.get(`/assignments/${id}`);

export const createAssignment = (data: FormData) =>
  API.post("/assignments", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const deleteAssignment = (id: string) =>
  API.delete(`/assignments/${id}`);

export const getPaper = (id: string) => API.get(`/assignments/${id}/paper`);

export const regeneratePaper = (id: string) =>
  API.post(`/assignments/${id}/regenerate`);

export default API;
