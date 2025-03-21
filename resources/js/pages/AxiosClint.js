import axios from "axios";
// const baseURL = import.meta.env.VITE_API_BASE_URL;
const baseURL = window.location.origin;
const axiosClient = axios.create({
    baseURL: baseURL+"/api",
});

axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("ACCESS_TOKEN");
    config.headers.Authorization = `Bearer ${token}`;
    return config;
});

axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        try {
            const { response } = error;
            if (response.status === 401) {
                localStorage.removeItem("ACCESS_TOKEN");
                localStorage.removeItem("USER");
                window.location.href = "/login";
            }
        } catch (err) {
            console.error(err);
        }
        throw error;
    }
);

export default axiosClient;