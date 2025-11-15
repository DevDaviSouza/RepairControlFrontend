import { api } from '@/config/api';
import type {
  Order,
  OrderFormData,
  OrderResponse,
  PaginationParams,
  ChangeStatusData,
  AlterCompletionDateData,
} from '@/types';

class OrdersService {
  private readonly basePath = '/orders';

  async findAll(params?: PaginationParams): Promise<OrderResponse> {
    const response = await api.get<OrderResponse>(this.basePath, { params });
    return response.data;
  }

  async findById(id: number): Promise<Order> {
    const response = await api.get<Order>(`${this.basePath}/${id}`);
    return response.data;
  }

  async findDelayed(params?: PaginationParams): Promise<OrderResponse> {
    const response = await api.get<OrderResponse>(`${this.basePath}/late`, { params });
    return response.data;
  }

  async findDelayedCount(): Promise<{ total: number }> {
    const response = await api.get<{ total: number }>(`${this.basePath}/late/count`);
    return response.data;
  }

  async findPendingPainting(): Promise<number> {
    const response = await api.get<number>(`${this.basePath}/pendingPainting`);
    return response.data;
  }

  async findProxLate(): Promise<Order[]> {
    const response = await api.get<Order[]>(`${this.basePath}/proxLate`);
    return response.data;
  }

  async findDeliveryItems(): Promise<number> {
    const response = await api.get<number>(`${this.basePath}/deliveryItems`);
    return response.data;
  }

  async create(data: OrderFormData): Promise<void> {
    await api.post(this.basePath, data);
  }

  async update(id: number, data: OrderFormData): Promise<{ message: string; order: Order }> {
    const response = await api.put<{ message: string; order: Order }>(
      `${this.basePath}/${id}`,
      data
    );
    return response.data;
  }

  async changeStatus(id: number, data: ChangeStatusData): Promise<{ message: string; order: Order }> {
    const response = await api.put<{ message: string; order: Order }>(
      `${this.basePath}/alterStatus/${id}`,
      data
    );
    return response.data;
  }

  async finalize(id: number): Promise<{ message: string; order: Order }> {
    const response = await api.put<{ message: string; order: Order }>(
      `${this.basePath}/finalize/${id}`
    );
    return response.data;
  }

  async alterCompletionDate(id: number, data: AlterCompletionDateData): Promise<{ message: string; order: Order }> {
    const response = await api.put<{ message: string; order: Order }>(
      `${this.basePath}/alterCompletion/${id}`,
      data
    );
    return response.data;
  }

  async delete(id: number): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`${this.basePath}/${id}`);
    return response.data;
  }
}

export const ordersService = new OrdersService();

