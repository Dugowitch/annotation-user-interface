import axios from "axios"
import { TEST_API_KEY } from "../app.config"


const instance = axios.create({
    baseURL: TEST_API_KEY ? "https://api.spokendata.com/v2/jobs" : "https://spokendata.com/api/v2/jobs",
    headers: {
        'X-API-KEY': TEST_API_KEY || undefined,
        'Accept': "application/json",
    }
})

export default instance
