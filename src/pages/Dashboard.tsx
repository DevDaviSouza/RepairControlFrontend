import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components';
import { Loading } from '@/components';
import { ordersService } from '@/services/OrdersService';
import { paymentsService } from '@/services/PaymentsService';
import { useToast } from '@/hooks/useToast';
import { format } from 'date-fns';


export const Dashboard = () => {
  const [delayedCount, setDelayedCount] = useState(0);
  const [pendingPainting, setPendingPainting] = useState(0);
  const [proxLate, setProxLate] = useState<any[]>([]);
  const [deliveryItems, setDeliveryItems] = useState(0);
  const [totalPayments, setTotalPayments] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const [delayed, painting, prox, delivery, payments] = await Promise.all([
        ordersService.findDelayedCount(),
        ordersService.findPendingPainting(),
        ordersService.findProxLate(),
        ordersService.findDeliveryItems(),
        paymentsService.findTotal(),
      ]);

      setDelayedCount(delayed.total);
      setPendingPainting(painting);
      setProxLate(prox);
      setDeliveryItems(delivery);
      setTotalPayments(Number(payments._sum.vl_payment || 0));
    } catch (error) {
      showToast('Erro ao carregar dados do dashboard', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-dv-text mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card surface={false} className="bg-dv-red border-none text-white">
          <div className="text-sm text-white/80 mb-1">Ordens Atrasadas</div>
          <div className="text-3xl font-bold">{delayedCount}</div>
          <Link to="/orders?filter=late" className="text-dv-lime text-sm mt-2 inline-block">
            Ver detalhes →
          </Link>
        </Card>

        <Card surface={false} className="bg-dv-gold border-none text-white">
          <div className="text-sm text-white/80 mb-1">Pendentes de Pintura</div>
          <div className="text-3xl font-bold">{pendingPainting}</div>
        </Card>

        <Card surface={false} className="bg-dv-blue border-none text-white">
          <div className="text-sm text-white/80 mb-1">Peças Entregues (Mês)</div>
          <div className="text-3xl font-bold">{deliveryItems}</div>
        </Card>

        <Card surface={false} className="bg-dv-green border-none text-white">
          <div className="text-sm text-white/80 mb-1">Total Recebido</div>
          <div className="text-3xl font-bold">
            R$ {totalPayments.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
        </Card>
      </div>

      {proxLate.length > 0 && (
        <Card title="Ordens Próximas do Prazo (2 dias)">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-dv-border">
              <thead className="bg-dv-surfaceAlt">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dv-textMuted uppercase">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dv-textMuted uppercase">
                    Modelo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dv-textMuted uppercase">
                    Placa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dv-textMuted uppercase">
                    Data Conclusão
                  </th>
                </tr>
              </thead>
              <tbody className="bg-dv-surface divide-y divide-dv-border">
                {proxLate.map((order) => (
                  <tr key={order.order_id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-dv-text">
                      #{order.order_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-dv-text">
                      {order.ds_model}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-dv-text">
                      {order.ds_plate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-dv-text">
                      {order.dt_completion
                        ? format(new Date(order.dt_completion), "dd/MM/yyyy")
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

