import request from "./Request";
import { AxiosRequestConfig } from "axios";

class HttpRequest {
  static get<T = any>(
    url: string,
    params: Record<string, any> = {},
    config: AxiosRequestConfig = {}
  ): Promise<T> {
    return request<T>({
      url,
      method: "GET",
      params,
      ...config,
    });
  }

  static post<T = any>(
    url: string,
    data?: any,
    config: AxiosRequestConfig = {}
  ): Promise<T> {
    return request<T>({
      url,
      method: "POST",
      data,
      ...config,
    });
  }

  static patch<T = any>(
    url: string,
    data?: any,
    config: AxiosRequestConfig = {}
  ): Promise<T> {
    return request<T>({
      url,
      method: "PATCH",
      data,
      ...config,
    });
  }

  static put<T = any>(
    url: string,
    data?: any,
    config: AxiosRequestConfig = {}
  ): Promise<T> {
    return request<T>({
      url,
      method: "PUT",
      data,
      ...config,
    });
  }

  static delete<T = any>(
    url: string,
    config: AxiosRequestConfig = {}
  ): Promise<T> {
    return request<T>({
      url,
      method: "DELETE",
      ...config,
    });
  }
}

export default HttpRequest;
