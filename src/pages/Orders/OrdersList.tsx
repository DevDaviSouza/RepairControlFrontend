import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components';
import { Table, TableRow, TableCell } from '@/components';
import { Loading } from '@/components';
import { Pagination } from '@/components';
import { Modal } from '@/components';
import { ordersService } from '@/services/OrdersService';
import { customersService } from '@/services/CustomersService';
import { statusOrderService } from '@/services/StatusOrderService';
import { useToast } from '@/hooks/useToast';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import type { Order, Customer, StatusOrder } from '@/types';

export const OrdersList = () => {
  const [searchParams] = useSearchParams();
  const filter = searchParams.get('filter');
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<number | null>(null);
  const [customers, setCustomers] = useState<Map<number, Customer>>(new Map());
  const [statuses, setStatuses] = useState<Map<number, StatusOrder>>(new Map());
  const itemsPerPage = 10;
  const { showToast } = useToast();

  useEffect(() => {
    loadData();
  }, [currentPage, filter]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [ordersResponse, customersData, statusesData] = await Promise.all([
        filter === 'late'
          ? ordersService.findDelayed({ page: currentPage - 1, limit: itemsPerPage })
          : ordersService.findAll({ page: currentPage - 1, limit: itemsPerPage }),
        customersService.findAll({ page: 0, limit: 100 }),
        statusOrderService.findAll(),
      ]);

      setOrders(ordersResponse.items);
      setTotalItems(ordersResponse.totalItems);

      const customersMap = new Map<number, Customer>();
      customersData.items.forEach((customer) => {
        if (customer.customers_id) {
          customersMap.set(customer.customers_id, customer);
        }
      });
      setCustomers(customersMap);

      const statusesMap = new Map<number, StatusOrder>();
      statusesData.forEach((status) => {
        if (status.status_id) {
          statusesMap.set(status.status_id, status);
        }
      });
      setStatuses(statusesMap);
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Erro ao carregar dados', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!orderToDelete) return;

    try {
      await ordersService.delete(orderToDelete);
      showToast('Ordem excluida com sucesso', 'success');
      setDeleteModalOpen(false);
      setOrderToDelete(null);
      loadData();
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Erro ao excluir ordem', 'error');
    }
  };

  const openDeleteModal = (id: number) => {
    setOrderToDelete(id);
    setDeleteModalOpen(true);
  };

  const getStatusColor = (statusId: number | null) => {
    const colors: Record<number, string> = {
      1: 'bg-[rgba(75,141,255,0.2)] text-[#A9C8FF]',
      2: 'bg-[rgba(208,167,78,0.2)] text-[#FFDFA2]',
      3: 'bg-[rgba(61,175,98,0.2)] text-[#AAEAC0]',
      4: 'bg-[rgba(154,118,50,0.2)] text-[#F2CD8D]',
      5: 'bg-[rgba(226,75,98,0.25)] text-[#FFC3CD]',
      6: 'bg-[rgba(101,118,156,0.24)] text-[#D6E0FB]',
      7: 'bg-[rgba(126,228,161,0.2)] text-[#B8F3CD]',
    };
    return colors[statusId || 1] || 'bg-[rgba(101,118,156,0.24)] text-[#D6E0FB]';
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (isLoading && orders.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className="text-dv-text space-y-6">
      <section className="rounded-2xl border border-dv-border bg-gradient-to-r from-dv-surface to-dv-backgroundSoft p-6 md:p-8 shadow-card-dark flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="font-display text-5xl leading-none text-white">
            {filter === 'late' ? 'ORDENS ATRASADAS' : 'ORDENS DE SERVICO'}
          </h1>
          <p className="mt-3 text-dv-textMuted">Gerencie e acompanhe a precisao tecnica dos reparos industriais.</p>
        </div>
        <Link to="/orders/new">
          <Button variant="primary" className="w-full lg:w-auto px-6 py-3">Nova Ordem</Button>
        </Link>
      </section>

      <div>
        <Table headers={['ID', 'Modelo', 'Placa', 'Cliente', 'Data Pedido', 'Data Conclusao', 'Status', 'Valor Total', 'Acoes']}>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-12 text-dv-textMuted">
                Nenhuma ordem encontrada
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => {
              const customer = order.customer_id ? customers.get(order.customer_id) : null;
              const status = order.status_id ? statuses.get(order.status_id) : null;

              return (
                <TableRow key={order.order_id}>
                  <TableCell>#{order.order_id}</TableCell>
                  <TableCell>{order.ds_model || '-'}</TableCell>
                  <TableCell>{order.ds_plate || '-'}</TableCell>
                  <TableCell>
                    {customer?.nm_customer || (order.customer_id ? `Cliente #${order.customer_id}` : '-')}
                  </TableCell>
                  <TableCell>
                    {order.dt_order ? format(new Date(order.dt_order), 'dd/MM/yyyy', { locale: ptBR }) : '-'}
                  </TableCell>
                  <TableCell>
                    {order.dt_completion ? format(new Date(order.dt_completion), 'dd/MM/yyyy', { locale: ptBR }) : '-'}
                  </TableCell>
                  <TableCell>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status_id)}`}>
                      {status?.ds_status || (order.status_id ? `Status ${order.status_id}` : 'Sem Status')}
                    </span>
                  </TableCell>
                  <TableCell>
                    {order.vl_total
                      ? `R$ ${Number(order.vl_total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                      : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Link to={`/orders/${order.order_id}`}>
                        <Button variant="secondary" className="text-xs py-1 px-3">
                          Ver
                        </Button>
                      </Link>
                      <Button
                        variant="danger"
                        className="text-xs py-1 px-3"
                        onClick={() => openDeleteModal(order.order_id)}
                      >
                        Excluir
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
        />
      )}

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setOrderToDelete(null);
        }}
        title="Confirmar Exclusao"
      >
        <p className="mb-4">Tem certeza que deseja excluir esta ordem?</p>
        <div className="flex justify-end gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              setDeleteModalOpen(false);
              setOrderToDelete(null);
            }}
          >
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Excluir
          </Button>
        </div>
      </Modal>
    </div>
  );
};
