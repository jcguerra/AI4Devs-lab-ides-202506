import axios, { AxiosResponse, AxiosError } from 'axios';
import { ApiResponse } from '../types/candidate.types';
import { config } from '../config/config';

const API_BASE_URL = config.API_URL;
const API_VERSION = config.API_VERSION;

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = `${API_BASE_URL}/api/${API_VERSION}`;
    this.setupAxiosDefaults();
  }

  private setupAxiosDefaults() {
    axios.defaults.baseURL = this.baseURL;
    axios.defaults.headers.common['Content-Type'] = 'application/json';
    axios.defaults.timeout = 30000; // 30 segundos

    // Interceptor para respuestas
    axios.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, params?: any): Promise<ApiResponse<T>> {
    try {
      const response = await axios.get<ApiResponse<T>>(url, { params });
      return response.data;
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await axios.post<ApiResponse<T>>(url, data);
      return response.data;
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await axios.put<ApiResponse<T>>(url, data);
      return response.data;
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    try {
      const response = await axios.delete<ApiResponse<T>>(url);
      return response.data;
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  async upload<T>(url: string, formData: FormData): Promise<ApiResponse<T>> {
    try {
      const response = await axios.post<ApiResponse<T>>(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  private handleError(error: AxiosError): ApiResponse<any> {
    if (error.response?.data) {
      return error.response.data as ApiResponse<any>;
    }

    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: error.message || 'Error de conexión con el servidor'
      },
      meta: {
        timestamp: new Date().toISOString()
      }
    };
  }

  // Método para obtener la URL base
  getBaseURL(): string {
    return this.baseURL;
  }
}

export const apiService = new ApiService();
export default apiService; 