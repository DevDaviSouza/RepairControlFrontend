import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components';
import { Select } from '@/components';
import { Button } from '@/components';
import { Loading } from '@/components';
import { ordersService } from '@/services/OrdersService';
import { customersService } from '@/services/CustomersService';
import { enterprisesService } from '@/services/EnterprisesService';
import { priorityService } from '@/services/PriorityService';
import { useToast } from '@/hooks/useToast';
import type { Customer, Enterprise, Priority } from '@/types';

const orderSchema = z.object({
  customerId: z.number().min(1, 'Selecione um cliente'),
  dsModel: z.string().min(1, 'Modelo é obrigatório'),
  dsColor: z.string().min(1, 'Cor é obrigatória'),
  dtYear: z.number().min(1900).max(new Date().getFullYear() + 1),
  dsPlate: z.string().min(1, 'Placa é obrigatória'),
  qtdRepair: z.number().min(0),
  qtdPainting: z.number().min(0),
  dtOrder: z.string().min(1, 'Data do pedido é obrigatória'),
  dtCompletion: z.string().min(1, 'Data de conclusão é obrigatória'),
  dsServices: z.string().min(1, 'Descrição dos serviços é obrigatória'),
  priorityId: z.number().min(1, 'Selecione uma prioridade'),
  vlTotal: z.number().min(0, 'Valor total deve ser maior ou igual a zero'),
  enterpriseId: z.number().min(1, 'Selecione uma empresa'),
});

type OrderFormData = z.infer<typeof orderSchema>;

export const OrderForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(isEdit);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      dtOrder: new Date().toISOString().split('T')[0],
    },
  });

  useEffect(() => {
    loadOptions();
    if (isEdit) {
      loadOrder();
    }
  }, [id]);

  const loadOptions = async () => {
    try {
      const [customersData, enterprisesData, prioritiesData] = await Promise.all([
        customersService.findAll({ page: 0, limit: 100 }),
        enterprisesService.findAll(),
        priorityService.findAll(),
      ]);
      setCustomers(customersData.items);
      setEnterprises(enterprisesData);
      setPriorities(prioritiesData);
    } catch (error: any) {
      showToast('Erro ao carregar opções', 'error');
    }
  };

  const loadOrder = async () => {
    try {
      setIsLoadingData(true);
      const order = await ordersService.findById(Number(id));
      setValue('customerId', order.customer_id || 0);
      setValue('dsModel', order.ds_model || '');
      setValue('dsColor', order.ds_color || '');
      setValue('dtYear', order.dt_year || new Date().getFullYear());
      setValue('dsPlate', order.ds_plate || '');
      setValue('qtdRepair', order.qtd_repair || 0);
      setValue('qtdPainting', order.qtd_painting || 0);
      setValue('dtOrder', order.dt_order ? new Date(order.dt_order).toISOString().split('T')[0] : '');
      setValue('dtCompletion', order.dt_completion ? new Date(order.dt_completion).toISOString().split('T')[0] : '');
      setValue('dsServices', order.ds_services || '');
      setValue('priorityId', order.priority_id || 0);
      setValue('vlTotal', Number(order.vl_total || 0));
      setValue('enterpriseId', order.enterprise_id || 0);
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Erro ao carregar ordem', 'error');
      navigate('/orders');
    } finally {
      setIsLoadingData(false);
    }
  };

  const onSubmit = async (data: OrderFormData) => {
    try {
      setIsLoading(true);
      const orderData = {
        ...data,
        dtOrder: new Date(data.dtOrder).toISOString(),
        dtCompletion: new Date(data.dtCompletion).toISOString(),
      };

      if (isEdit) {
        await ordersService.update(Number(id), orderData);
        showToast('Ordem atualizada com sucesso', 'success');
      } else {
        await ordersService.create(orderData);
        showToast('Ordem criada com sucesso', 'success');
      }
      navigate('/orders');
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Erro ao salvar ordem', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto text-dv-text">
      <h1 className="text-2xl font-bold text-dv-text mb-6">
        {isEdit ? 'Editar Ordem de Serviço' : 'Nova Ordem de Serviço'}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-dv-surface shadow-card-dark border border-dv-border rounded-2xl p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Cliente *"
            {...register('customerId', { valueAsNumber: true })}
            error={errors.customerId?.message}
            options={customers.map((c) => ({
              value: c.customers_id,
              label: c.nm_customer || `Cliente #${c.customers_id}`,
            }))}
          />

          <Select
            label="Empresa *"
            {...register('enterpriseId', { valueAsNumber: true })}
            error={errors.enterpriseId?.message}
            options={enterprises.map((e) => ({
              value: e.enterprise_id,
              label: e.nm_enterprise || e.ep_fantasy || `Empresa #${e.enterprise_id}`,
            }))}
          />

          <Input
            label="Modelo *"
            {...register('dsModel')}
            error={errors.dsModel?.message}
            placeholder="Ex: Honda Civic"
          />

          <Input
            label="Cor *"
            {...register('dsColor')}
            error={errors.dsColor?.message}
            placeholder="Ex: Branco"
          />

          <Input
            label="Ano *"
            type="number"
            {...register('dtYear', { valueAsNumber: true })}
            error={errors.dtYear?.message}
            placeholder="2020"
          />

          <Input
            label="Placa *"
            {...register('dsPlate')}
            error={errors.dsPlate?.message}
            placeholder="ABC1234"
            maxLength={7}
          />

          <Input
            label="Quantidade Reparos"
            type="number"
            {...register('qtdRepair', { valueAsNumber: true })}
            error={errors.qtdRepair?.message}
            defaultValue={0}
          />

          <Input
            label="Quantidade Pinturas"
            type="number"
            {...register('qtdPainting', { valueAsNumber: true })}
            error={errors.qtdPainting?.message}
            defaultValue={0}
          />

          <Input
            label="Data do Pedido *"
            type="date"
            {...register('dtOrder')}
            error={errors.dtOrder?.message}
          />

          <Input
            label="Data de Conclusão *"
            type="date"
            {...register('dtCompletion')}
            error={errors.dtCompletion?.message}
          />

          <Select
            label="Prioridade *"
            {...register('priorityId', { valueAsNumber: true })}
            error={errors.priorityId?.message}
            options={priorities.map((p) => ({
              value: p.priority_id,
              label: p.ds_priority,
            }))}
          />

          <Input
            label="Valor Total *"
            type="number"
            step="0.01"
            {...register('vlTotal', { valueAsNumber: true })}
            error={errors.vlTotal?.message}
            placeholder="0.00"
          className="bg-[#B9FFB1] text-[#0F2E09]"
          />
        </div>

        <Input
          label="Descrição dos Serviços *"
          {...register('dsServices')}
          error={errors.dsServices?.message}
          placeholder="Descreva os serviços a serem realizados"
        />

        <div className="flex gap-2 justify-end mt-6">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/orders')}
          >
            Cancelar
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {isEdit ? 'Atualizar' : 'Criar'}
          </Button>
        </div>
      </form>
    </div>
  );
};

