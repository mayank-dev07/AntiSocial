import axios from "axios";
import useStore from "../zustand/zustan";
export const url = "http://localhost:8080/api/";

const IncCount = useStore.getState().increaseCounter;
const decCount = useStore.getState().decreaseCounter;

const axiosInstance = axios.create({
  baseURL: url,
  withCredentials: true,
  headers: {
    "Content-Type": undefined,
    // "ngrok-skip-browser-warning": "true",
    "Access-Control-Allow-Origin": "*",
    // "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
  },
});
axiosInstance.interceptors.request.use(
  function (config) {
    IncCount();

    return config;
  },
  function (error) {
    decCount();

    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  function (response) {
    decCount();

    return response;
  },
  function (error) {
    decCount();
    return Promise.reject(error);
  }
);

export default axiosInstance;
