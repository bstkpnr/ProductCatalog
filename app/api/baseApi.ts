import axios, { InternalAxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://dummyjson.com', 
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
  
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);


axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);


export default axiosInstance;
