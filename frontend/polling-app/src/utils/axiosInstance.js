import axios from "axios"
import { BASE_URL } from "./apiPaths"

export const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
    }
})

//! Request Interceptor

axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("token")
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`

        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

//! Response Interceptor

axiosInstance.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {

        //! Handle common errors globally

        if (error.response) {
            if (error.response.status === 401) {
                //! Token expired or unauthorized
                console.log("Unauthorized ! Redirecting to login...");
                //! Redirecting to login
                window.location.href = "/login"
            } else if (error.response.status === 500) {
                console.log("Server error. Please try again later.");
            } else if (error.code === "ECONNABORTED") {
                console.log("Request time out. Please try again.");
            }
        }
        return Promise.reject(error)
    }
)