import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components';
import { Button } from '@/components';
import { Loading } from '@/components';
import { Table, TableRow, TableCell } from '@/components';
import { ordersService } from '@/services/OrdersService';
import { customersService } from '@/services/CustomersService';
import { paymentsService } from '@/services/PaymentsService';
import { useToast } from '@/hooks/useToast';
import type { Order, Payment, Customer } from '@/types';

export const SelectOrderForPayment = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [customers, setCustomers] = useState<Map<number, Customer>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [ordersData, paymentsData, customersData] = await Promise.all([
        ordersService.findAll({ page: 0, limit: 100 }),
        paymentsService.findAll(),
        customersService.findAll({ page: 0, limit: 1000 }),
      ]);
      setOrders(ordersData.items);
      setPayments(paymentsData);

      // Criar mapa de clientes para busca rápida
      const customersMap = new Map<number, Customer>();
      customersData.items.forEach((customer) => {
        if (customer.customers_id) {
          customersMap.set(customer.customers_id, customer);
        }
      });
      setCustomers(customersMap);
    } catch (error: any) {
      showToast('Erro ao carregar dados', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const ordersWithoutPayment = orders.filter((order) => {
    const hasPayment = payments.some((payment) => payment.order_id === order.order_id);
    return !hasPayment && order.vl_total && Number(order.vl_total) > 0;
  });

  const filteredOrders = ordersWithoutPayment.filter((order) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      order.order_id.toString().includes(search) ||
      order.ds_model?.toLowerCase().includes(search) ||
      order.ds_plate?.toLowerCase().includes(search) ||
      order.customer_id?.toString().includes(search)
    );
  });

  const handleSelectOrder = (orderId: number) => {
    navigate(`/payments/${orderId}/new`);
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Selecionar Ordem para Pagamento</h1>
        <Button variant="secondary" onClick={() => navigate('/payments')}>
          Voltar
        </Button>
      </div>

      <div className="mb-4">
        <Input
          label="Buscar Ordem"
          placeholder="Buscar por ID, modelo, placa ou cliente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <Table
          headers={['ID', 'Modelo', 'Placa', 'Cliente ID', 'Valor Total', 'Ação']}
        >
          {filteredOrders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                {searchTerm
                  ? 'Nenhuma ordem encontrada com os filtros aplicados'
                  : 'Todas as ordens já possuem pagamento vinculado'}
              </TableCell>
            </TableRow>
          ) : (
            filteredOrders.map((order) => {
              const customer = order.customer_id ? customers.get(order.customer_id) : null;
              
              return (
                <TableRow key={order.order_id}>
                  <TableCell>#{order.order_id}</TableCell>
                  <TableCell>{order.ds_model || '-'}</TableCell>
                  <TableCell>{order.ds_plate || '-'}</TableCell>
                  <TableCell>
                    {customer?.nm_customer || (order.customer_id ? `Cliente #${order.customer_id}` : '-')}
                  </TableCell>
                  <TableCell>
                    {order.vl_total
                      ? `R$ ${Number(order.vl_total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                      : '-'}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="primary"
                      className="text-xs py-1 px-2"
                      onClick={() => handleSelectOrder(order.order_id)}
                    >
                      Criar Pagamento
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </Table>
      </div>
    </div>
  );
};

