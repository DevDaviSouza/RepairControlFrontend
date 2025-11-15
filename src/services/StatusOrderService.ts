import { api } from '@/config/api';
import type { StatusOrder, StatusOrderFormData } from '@/types';

class StatusOrderService {
  private readonly basePath = '/statusOrder';

  async findAll(): Promise<StatusOrder[]> {
    const response = await api.get<StatusOrder[]>(this.basePath);
    return response.data;
  }

  async create(data: StatusOrderFormData): Promise<{ message: string; id: number }> {
    const response = await api.post<{ message: string; id: number }>(this.basePath, {
      status: data.status,
    });
    return response.data;
  }
}

export const statusOrderService = new StatusOrderService();

