import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ 認証トークン付与などはここで一元管理
axiosInstance.interceptors.request.use((config) => {
  // ここで認証トークンを付与
  config.headers = config.headers ?? {};
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ orvalが要求する「mutator形式」の関数をexport
export const customInstance = <T = unknown>(config: AxiosRequestConfig ) => {
  return axiosInstance.request<T>(config);
};


