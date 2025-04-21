import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

// Set base URL from environment
const baseUrl: string = import.meta.env.VITE_APP_BASE_URL_LOCAL as string;

// Create Axios instance
const instance: AxiosInstance | any = axios.create({
  baseURL: baseUrl,
  timeout: 1000 * 60,
  responseType: "json",
});

// Optional: Attach cancel helpers
instance.CancelToken = axios.CancelToken;
instance.isCancel = axios.isCancel;
instance.Cancel = axios.Cancel;

// Interceptors
instance.interceptors.request.use(
  async function (config: AxiosRequestConfig) {
    const token = localStorage.getItem("access_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  function (error: AxiosError) {
    return Promise.reject(error);
  }
);

// Response handlers
const successResponse = <T>(response: AxiosResponse<T>): T => response.data;
const failResponse = (error: AxiosError) => Promise.reject(error);

// Request wrapper function
const Request = <T = any>(options: AxiosRequestConfig): Promise<T> =>
  instance(options).then(successResponse).catch(failResponse);

export default Request;
