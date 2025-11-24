import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Input } from '@/components';
import { Button } from '@/components';
import { Card } from '@/components';
import { Loading } from '@/components';
import { paymentsService } from '@/services/PaymentsService';
import { ordersService } from '@/services/OrdersService';
import { useToast } from '@/hooks/useToast';
import type { Order, Payment } from '@/types';

export const PaymentForm = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [payment, setPayment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingOrder, setIsLoadingOrder] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);
  const [existingPayment, setExistingPayment] = useState<Payment | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    if (orderId) {
      loadOrderData();
    }
  }, [orderId]);

  const loadOrderData = async () => {
    try {
      setIsLoadingOrder(true);
      const [orderData, paymentsData] = await Promise.all([
        ordersService.findById(Number(orderId)),
        paymentsService.findAll(),
      ]);
      setOrder(orderData);
      const payment = paymentsData.find((p) => p.order_id === Number(orderId));
      setExistingPayment(payment || null);
    } catch (error: any) {
      showToast('Erro ao carregar dados da ordem', 'error');
      navigate('/payments');
    } finally {
      setIsLoadingOrder(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!payment || Number(payment) <= 0) {
      showToast('Valor do pagamento deve ser maior que zero', 'error');
      return;
    }

    if (!order?.vl_total) {
      showToast('Ordem não possui valor total definido', 'error');
      return;
    }

    const paymentValue = Number(payment);
    const orderTotal = Number(order.vl_total);

    if (existingPayment) {
      const remaining = Number(existingPayment.vl_reamining || 0);
      if (paymentValue > remaining) {
        showToast(`Valor não pode ser maior que o restante (R$ ${remaining.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})`, 'error');
        return;
      }
    } else {
      if (paymentValue > orderTotal) {
        showToast(`Valor não pode ser maior que o total da ordem (R$ ${orderTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})`, 'error');
        return;
      }
    }

    try {
      setIsLoading(true);
      await paymentsService.create(Number(orderId), { payment: paymentValue });
      showToast(existingPayment ? 'Valor adicionado ao pagamento com sucesso' : 'Pagamento criado com sucesso', 'success');
      navigate('/payments');
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Erro ao criar pagamento', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingOrder) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loading size="lg" />
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const orderTotal = Number(order.vl_total || 0);
  const maxPayment = existingPayment 
    ? Number(existingPayment.vl_reamining || 0)
    : orderTotal;

  return (
    <div className="max-w-2xl mx-auto text-dv-text">
      <h1 className="text-2xl font-bold text-dv-text mb-6">
        {existingPayment ? 'Adicionar Valor ao Pagamento' : 'Novo Pagamento'} - Ordem #{orderId}
      </h1>

      <Card className="mb-6">
        <h3 className="font-semibold mb-3">Informações da Ordem</h3>
        <div className="space-y-2 text-sm">
          <div>
            <span className="font-medium">Modelo: </span>
            {order.ds_model || '-'}
          </div>
          <div>
            <span className="font-medium">Placa: </span>
            {order.ds_plate || '-'}
          </div>
          <div>
            <span className="font-medium">Valor Total da Ordem: </span>
            <span className="text-dv-lime font-semibold">
              R$ {orderTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          {existingPayment && (
            <>
              <div>
                <span className="font-medium">Valor Já Pago: </span>
                R$ {Number(existingPayment.vl_payment || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <div>
                <span className="font-medium">Valor Restante: </span>
                <span className="text-dv-gold font-semibold">
                  R$ {Number(existingPayment.vl_reamining || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </>
          )}
        </div>
      </Card>

      <form onSubmit={handleSubmit} className="bg-dv-surface border border-dv-border shadow-card-dark rounded-2xl p-6 space-y-4">
        <Input
          label={`Valor do Pagamento * (Máximo: R$ ${maxPayment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})`}
          type="number"
          step="0.01"
          max={maxPayment}
          value={payment}
          onChange={(e) => setPayment(e.target.value)}
          placeholder="0.00"
          required
        />

        {payment && Number(payment) > 0 && (
          <div className="bg-dv-surfaceAlt p-4 rounded-xl border border-dv-border">
            <div className="text-sm">
              <div className="font-medium mb-1">Resumo:</div>
              <div>Valor a pagar: R$ {Number(payment).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              {existingPayment ? (
                <div>
                  Restante após pagamento: R$ {(maxPayment - Number(payment)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              ) : (
                <div>
                  Restante após pagamento: R$ {(orderTotal - Number(payment)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-2 justify-end mt-6">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/payments')}
          >
            Cancelar
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {existingPayment ? 'Adicionar Valor' : 'Criar Pagamento'}
          </Button>
        </div>
      </form>
    </div>
  );
};

