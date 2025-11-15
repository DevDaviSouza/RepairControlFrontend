import { api } from '@/config/api';
import type { User } from '@/types';

class UsersService {
  private readonly basePath = '/users';

  async findAll(): Promise<User[]> {
    const response = await api.get<User[]>(this.basePath);
    return response.data;
  }
}

export const usersService = new UsersService();

