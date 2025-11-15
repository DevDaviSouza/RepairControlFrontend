import { api } from '@/config/api';
import type { Enterprise, EnterpriseFormData } from '@/types';

class EnterprisesService {
  private readonly basePath = '/enterprises';

  async findAll(): Promise<Enterprise[]> {
    const response = await api.get<Enterprise[]>(this.basePath);
    return response.data;
  }

  async create(data: EnterpriseFormData): Promise<{ message: string; id: number }> {
    const response = await api.post<{ message: string; id: number }>(this.basePath, data);
    return response.data;
  }
}

export const enterprisesService = new EnterprisesService();

