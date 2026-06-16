import axios from 'axios';

const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
const backendHost = isLocalhost ? 'localhost' : (typeof window !== 'undefined' ? window.location.hostname : 'localhost');

const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === "development" ? `http://${backendHost}:5500/api/v1` : '/api/v1',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});


export default axiosInstance;