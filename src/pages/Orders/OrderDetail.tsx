import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Button } from '@/components';
import { Card } from '@/components';
import { Loading } from '@/components';
import { Modal } from '@/components';
import { Select } from '@/components';
import { Input } from '@/components';
import { ordersService } from '@/services/OrdersService';
import { customersService } from '@/services/CustomersService';
import { statusOrderService } from '@/services/StatusOrderService';
import { useToast } from '@/hooks/useToast';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import type { Order, StatusOrder, Customer } from '@/types';

export const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [statuses, setStatuses] = useState<StatusOrder[]>([]);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [currentStatus, setCurrentStatus] = useState<StatusOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingAction, setIsLoadingAction] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [completionDateModalOpen, setCompletionDateModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<number>(0);
  const [newCompletionDate, setNewCompletionDate] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [orderData, statusesData] = await Promise.all([
        ordersService.findById(Number(id)),
        statusOrderService.findAll(),
      ]);
      
      setOrder(orderData);
      setStatuses(statusesData);

      // Buscar cliente se houver customer_id
      if (orderData.customer_id) {
        try {
          const customerData = await customersService.findById(orderData.customer_id);
          setCustomer(customerData);
        } catch (error) {
          // Cliente não encontrado, continuar sem erro
        }
      }

      // Buscar status atual
      if (orderData.status_id) {
        const status = statusesData.find((s) => s.status_id === orderData.status_id);
        if (status) {
          setCurrentStatus(status);
        }
      }
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Erro ao carregar ordem', 'error');
      navigate('/orders');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeStatus = async () => {
    if (!selectedStatus) {
      showToast('Selecione um status', 'warning');
      return;
    }

    try {
      setIsLoadingAction(true);
      await ordersService.changeStatus(Number(id), { status: selectedStatus });
      showToast('Status alterado com sucesso', 'success');
      setStatusModalOpen(false);
      setSelectedStatus(0);
      loadData();
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Erro ao alterar status', 'error');
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleFinalize = async () => {
    if (!window.confirm('Tem certeza que deseja finalizar esta ordem?')) {
      return;
    }

    try {
      setIsLoadingAction(true);
      await ordersService.finalize(Number(id));
      showToast('Ordem finalizada com sucesso', 'success');
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Erro ao finalizar ordem', 'error');
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleAlterCompletionDate = async () => {
    if (!newCompletionDate) {
      showToast('Selecione uma data', 'warning');
      return;
    }

    try {
      setIsLoadingAction(true);
      await ordersService.alterCompletionDate(Number(id), {
        dtCompletion: new Date(newCompletionDate).toISOString(),
      });
      showToast('Data de conclusão alterada com sucesso', 'success');
      setCompletionDateModalOpen(false);
      setNewCompletionDate('');
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Erro ao alterar data', 'error');
    } finally {
      setIsLoadingAction(false);
    }
  };

  if (isLoading || !order) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Ordem de Serviço #{order.order_id}</h1>
        <div className="flex gap-2">
          <Link to={`/orders/${id}/edit`}>
            <Button variant="secondary">Editar</Button>
          </Link>
          <Link to={`/payments/${id}/new`}>
            <Button variant="primary">Criar Pagamento</Button>
          </Link>
          <Button
            variant="primary"
            onClick={() => setStatusModalOpen(true)}
            disabled={isLoadingAction}
          >
            Alterar Status
          </Button>
          <Button
            variant="success"
            onClick={handleFinalize}
            disabled={isLoadingAction || order.bt_delivered === true}
            isLoading={isLoadingAction}
          >
            Finalizar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card title="Informações do Veículo">
          <div className="space-y-2">
            <div>
              <span className="font-medium">Modelo: </span>
              {order.ds_model || '-'}
            </div>
            <div>
              <span className="font-medium">Cor: </span>
              {order.ds_color || '-'}
            </div>
            <div>
              <span className="font-medium">Ano: </span>
              {order.dt_year || '-'}
            </div>
            <div>
              <span className="font-medium">Placa: </span>
              {order.ds_plate || '-'}
            </div>
          </div>
        </Card>

        <Card title="Informações do Serviço">
          <div className="space-y-2">
            <div>
              <span className="font-medium">Cliente: </span>
              {customer?.nm_customer || (order.customer_id ? `Cliente #${order.customer_id}` : '-')}
            </div>
            <div>
              <span className="font-medium">Empresa ID: </span>
              {order.enterprise_id || '-'}
            </div>
            <div>
              <span className="font-medium">Status: </span>
              {currentStatus?.ds_status || (order.status_id ? `Status #${order.status_id}` : '-')}
            </div>
            <div>
              <span className="font-medium">Prioridade ID: </span>
              {order.priority_id || '-'}
            </div>
            <div>
              <span className="font-medium">Valor Total: </span>
              {order.vl_total
                ? `R$ ${Number(order.vl_total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                : '-'}
            </div>
          </div>
        </Card>

        <Card title="Quantidades">
          <div className="space-y-2">
            <div>
              <span className="font-medium">Reparos: </span>
              {order.qtd_repair || 0}
            </div>
            <div>
              <span className="font-medium">Pinturas: </span>
              {order.qtd_painting || 0}
            </div>
          </div>
        </Card>

        <Card title="Datas">
          <div className="space-y-2">
            <div>
              <span className="font-medium">Data do Pedido: </span>
              {order.dt_order
                ? format(new Date(order.dt_order), "dd/MM/yyyy HH:mm", { locale: ptBR })
                : '-'}
            </div>
            <div>
              <span className="font-medium">Data de Conclusão: </span>
              {order.dt_completion
                ? format(new Date(order.dt_completion), "dd/MM/yyyy", { locale: ptBR })
                : '-'}
              <Button
                variant="secondary"
                className="ml-2 text-xs py-1 px-2"
                onClick={() => setCompletionDateModalOpen(true)}
              >
                Alterar
              </Button>
            </div>
            <div>
              <span className="font-medium">Data de Entrega: </span>
              {order.dt_delivered
                ? format(new Date(order.dt_delivered), "dd/MM/yyyy HH:mm", { locale: ptBR })
                : '-'}
            </div>
            <div>
              <span className="font-medium">Entregue: </span>
              {order.bt_delivered ? 'Sim' : 'Não'}
            </div>
          </div>
        </Card>
      </div>

      <Card title="Descrição dos Serviços">
        <p className="text-gray-700">{order.ds_services || '-'}</p>
      </Card>

      <Modal
        isOpen={statusModalOpen}
        onClose={() => {
          setStatusModalOpen(false);
          setSelectedStatus(0);
        }}
        title="Alterar Status"
      >
        <div className="space-y-4">
          <Select
            label="Novo Status"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(Number(e.target.value))}
            options={statuses.map((s) => ({
              value: s.status_id,
              label: s.ds_status,
            }))}
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                setStatusModalOpen(false);
                setSelectedStatus(0);
              }}
            >
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleChangeStatus} isLoading={isLoadingAction}>
              Alterar
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={completionDateModalOpen}
        onClose={() => {
          setCompletionDateModalOpen(false);
          setNewCompletionDate('');
        }}
        title="Alterar Data de Conclusão"
      >
        <div className="space-y-4">
          <Input
            label="Nova Data de Conclusão"
            type="date"
            value={newCompletionDate}
            onChange={(e) => setNewCompletionDate(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                setCompletionDateModalOpen(false);
                setNewCompletionDate('');
              }}
            >
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleAlterCompletionDate} isLoading={isLoadingAction}>
              Alterar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

