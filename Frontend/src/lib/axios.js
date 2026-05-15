import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5500/api/v1',
  withCredentials: true, // Send cookies when cross-domain requests
});

export default axiosInstance;
