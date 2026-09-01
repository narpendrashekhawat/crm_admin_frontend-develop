import axios from "axios";
import { useAuth } from "./authContext";

const useAxios = () => {
    const { authToken } = useAuth();

    const axiosInstance = axios.create({
        baseURL: "http://157.15.202.188:8800",
    });

    axiosInstance.interceptors.request.use(
        (config) => {

            if (authToken) {
                console.log("Adding token to request:", authToken);
                config.headers["Authorization"] = `Bearer ${authToken}`;
            } else {
                console.log("No token found");
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    return axiosInstance;
}

export default useAxios;