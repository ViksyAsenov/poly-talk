import axios from "axios";
import toast from "react-hot-toast";

const API_BASE_URL = process.env.API_URL || "http://localhost:3005/";

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response?.data?.error?.message_error) {
        toast.error(error.response.data.error.message_error);
      }

      if (error.response?.status === 429) {
        toast.error("Too many requests. Please try again later.");
      }

      return Promise.resolve(error.response);
    }

    return Promise.reject(error);
  }
);

export { client };
