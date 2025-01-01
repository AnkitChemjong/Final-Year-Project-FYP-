import axios from 'axios';

export const axiosService=axios.create({
    baseURL:import.meta.env.VITE_BACKEND_URL
})