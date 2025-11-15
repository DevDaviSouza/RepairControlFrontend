import { api } from '@/config/api';
import type { Payment, PaymentFormData, TotalPaymentsResponse } from '@/types';

class PaymentsService {
  private readonly basePath = '/payments';
  private readonly paymentPath = '/payment';

  async findAll(): Promise<Payment[]> {
    const response = await api.get<Payment[]>(this.basePath);
    return response.data;
  }

  async findTotal(): Promise<TotalPaymentsResponse> {
    const response = await api.get<TotalPaymentsResponse>(`${this.basePath}/total`);
    return response.data;
  }

  async create(orderId: number, data: PaymentFormData): Promise<{ message: string; payment: Payment }> {
    const response = await api.post<{ message: string; payment: Payment }>(
      `${this.paymentPath}/${orderId}`,
      data
    );
    return response.data;
  }

  async update(id: number, data: PaymentFormData): Promise<{ message: string; payment: Payment }> {
    const response = await api.put<{ message: string; payment: Payment }>(
      `${this.paymentPath}/${id}`,
      data
    );
    return response.data;
  }

  async delete(id: number): Promise<{ message: string; payment: Payment }> {
    const response = await api.delete<{ message: string; payment: Payment }>(
      `${this.paymentPath}/${id}`
    );
    return response.data;
  }
}

export const paymentsService = new PaymentsService();

