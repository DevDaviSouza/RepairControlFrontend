import { api } from '@/config/api';
import type { Customer, CustomerFormData, CustomerResponse, PaginationParams } from '@/types';

class CustomersService {
  private readonly basePath = '/customers';

  async findAll(params?: PaginationParams): Promise<CustomerResponse> {
    const response = await api.get<CustomerResponse>(this.basePath, { params });
    return response.data;
  }

  async findById(id: number): Promise<Customer> {
    const response = await api.get<Customer>(`${this.basePath}/${id}`);
    return response.data;
  }

  async create(data: CustomerFormData): Promise<{ message: string; id: number }> {
    const response = await api.post<{ message: string; id: number }>(this.basePath, data);
    return response.data;
  }

  async update(id: number, data: CustomerFormData): Promise<{ message: string }> {
    const response = await api.put<{ message: string }>(`${this.basePath}/${id}`, data);
    return response.data;
  }

  async delete(id: number): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`${this.basePath}/${id}`);
    return response.data;
  }
}

export const customersService = new CustomersService();

