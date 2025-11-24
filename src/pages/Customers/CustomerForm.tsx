import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components';
import { Button } from '@/components';
import { Loading } from '@/components';
import { customersService } from '@/services/CustomersService';
import { useToast } from '@/hooks/useToast';

const customerSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  phone: z.string().min(8, 'Telefone inválido').max(19, 'Telefone inválido'),
  email: z.string().email('Email inválido'),
  cpf: z.string().min(11, 'CPF inválido').max(14, 'CPF inválido'),
});

type CustomerFormData = z.infer<typeof customerSchema>;

export const CustomerForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(isEdit);
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
  });

  useEffect(() => {
    if (isEdit) {
      loadCustomer();
    }
  }, [id]);

  const loadCustomer = async () => {
    try {
      setIsLoadingData(true);
      const customer = await customersService.findById(Number(id));
      setValue('name', customer.nm_customer || '');
      setValue('phone', customer.ds_phone || '');
      setValue('email', customer.ds_mail || '');
      setValue('cpf', customer.nm_cpf || '');
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Erro ao carregar cliente', 'error');
      navigate('/customers');
    } finally {
      setIsLoadingData(false);
    }
  };

  const onSubmit = async (data: CustomerFormData) => {
    try {
      setIsLoading(true);
      if (isEdit) {
        await customersService.update(Number(id), data);
        showToast('Cliente atualizado com sucesso', 'success');
      } else {
        await customersService.create(data);
        showToast('Cliente criado com sucesso', 'success');
      }
      navigate('/customers');
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Erro ao salvar cliente', 'error');
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
    <div className="max-w-2xl mx-auto text-dv-text">
      <h1 className="text-2xl font-bold text-dv-text mb-6">
        {isEdit ? 'Editar Cliente' : 'Novo Cliente'}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-dv-surface border border-dv-border shadow-card-dark rounded-2xl p-6 space-y-4">
        <Input
          label="Nome"
          {...register('name')}
          error={errors.name?.message}
          placeholder="Nome completo"
        />

        <Input
          label="CPF"
          {...register('cpf')}
          error={errors.cpf?.message}
          placeholder="000.000.000-00"
        />

        <Input
          label="Telefone"
          {...register('phone')}
          error={errors.phone?.message}
          placeholder="(00) 00000-0000"
        />

        <Input
          label="Email"
          type="email"
          {...register('email')}
          error={errors.email?.message}
          placeholder="email@exemplo.com"
        />

        <div className="flex gap-2 justify-end mt-6">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/customers')}
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

