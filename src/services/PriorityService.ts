import { api } from '@/config/api';
import type { Priority, PriorityFormData } from '@/types';

class PriorityService {
  private readonly basePath = '/priority';

  async findAll(): Promise<Priority[]> {
    const response = await api.get<Priority[]>(this.basePath);
    return response.data;
  }

  async create(data: PriorityFormData): Promise<{ message: string; id: number }> {
    const response = await api.post<{ message: string; id: number }>(this.basePath, data);
    return response.data;
  }
}

export const priorityService = new PriorityService();

