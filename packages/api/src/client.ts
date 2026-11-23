import axios from "axios";


export const apiClient = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
  baseURL: "http://localhost:8000/api/v1",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized responses through
      // the host application's authentication flow.
    }

    return Promise.reject(error);
  }
);