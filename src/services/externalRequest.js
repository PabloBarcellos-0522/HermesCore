const axios = require("axios")
const config = require("../config/env")

const externalApi = axios.create({
    baseURL: config.externalApiUrl,
    timeout: 10000, // 10 seconds timeout
    headers: {
        "Content-Type": "application/json",
    },
})

// Add a request interceptor to include the EXTERNAL_API_TOKEN
externalApi.interceptors.request.use(
    (reqConfig) => {
        if (config.externalApiToken) {
            reqConfig.headers["Authorization"] = `Bearer ${config.externalApiToken}`
        }
        return reqConfig
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Add a response interceptor to handle errors
externalApi.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        console.error("External API Request Error:", error.message)
        if (error.response) {
            console.error("External API Response Status:", error.response.status)
            console.error("External API Response Data:", error.response.data)
        }
        return Promise.reject(error)
    }
)

module.exports = externalApi
