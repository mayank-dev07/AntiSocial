import axios from "axios";
import useStore from "../zustand/zustan";
export const url = "/api/";

const IncCount = useStore.getState().increaseCounter;
const decCount = useStore.getState().decreaseCounter;

const axiosInstance = axios.create({
  baseURL: url,
  withCredentials: true,
  headers: {
    "Content-Type": undefined,
    "Access-Control-Allow-Origin": "*",
  },
});
axiosInstance.interceptors.request.use(
  function (config) {
    // //console.log(config.url);
    if (config.url.split("/")[0] !== "message") IncCount();

    return config;
  },
  function (error) {
    //console.log(error);
    decCount();

    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  function (response) {
    // //console.log(response.config);
    if (response.config.url.split("/")[0] !== "message") decCount();

    return response;
  },
  function (error) {
    decCount();
    return Promise.reject(error);
  }
);

export default axiosInstance;
