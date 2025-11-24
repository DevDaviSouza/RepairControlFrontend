import { useEffect, useState } from 'react';
import { Button } from '@/components';
import { Table, TableRow, TableCell } from '@/components';
import { Loading } from '@/components';
import { Modal } from '@/components';
import { enterprisesService } from '@/services/EnterprisesService';
import { useToast } from '@/hooks/useToast';
import type { Enterprise } from '@/types';

export const EnterprisesList = () => {
  const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nm_enterprise: '',
    ep_fantasy: '',
    ep_cnpj: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    loadEnterprises();
  }, []);

  const loadEnterprises = async () => {
    try {
      setIsLoading(true);
      const data = await enterprisesService.findAll();
      setEnterprises(data);
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Erro ao carregar empresas', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nm_enterprise || !formData.ep_cnpj) {
      showToast('Preencha todos os campos obrigatórios', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      await enterprisesService.create(formData);
      showToast('Empresa criada com sucesso', 'success');
      setCreateModalOpen(false);
      setFormData({ nm_enterprise: '', ep_fantasy: '', ep_cnpj: '' });
      loadEnterprises();
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Erro ao criar empresa', 'error');
    } finally {
      setIsSubmitting(false);
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
    <div className="text-dv-text">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-dv-text">Empresas</h1>
        <Button variant="primary" onClick={() => setCreateModalOpen(true)}>
          Nova Empresa
        </Button>
      </div>

      <div className="rounded-2xl">
        <Table
          headers={['ID', 'Razão Social', 'Nome Fantasia', 'CNPJ']}
        >
          {enterprises.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-dv-textMuted">
                Nenhuma empresa encontrada
              </TableCell>
            </TableRow>
          ) : (
            enterprises.map((enterprise) => (
              <TableRow key={enterprise.enterprise_id}>
                <TableCell>{enterprise.enterprise_id}</TableCell>
                <TableCell>{enterprise.nm_enterprise || '-'}</TableCell>
                <TableCell>{enterprise.ep_fantasy || '-'}</TableCell>
                <TableCell>{enterprise.ep_cnpj || '-'}</TableCell>
              </TableRow>
            ))
          )}
        </Table>
      </div>

      <Modal
        isOpen={createModalOpen}
        onClose={() => {
          setCreateModalOpen(false);
          setFormData({ nm_enterprise: '', ep_fantasy: '', ep_cnpj: '' });
        }}
        title="Nova Empresa"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dv-text mb-1">
              Razão Social *
            </label>
            <input
              type="text"
              value={formData.nm_enterprise}
              onChange={(e) => setFormData({ ...formData, nm_enterprise: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#EBEBEB] text-[#1C1C1C] placeholder:text-[#6B6B6B] border border-transparent focus:outline-none focus:ring-2 focus:ring-dv-green"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dv-text mb-1">
              Nome Fantasia
            </label>
            <input
              type="text"
              value={formData.ep_fantasy}
              onChange={(e) => setFormData({ ...formData, ep_fantasy: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#EBEBEB] text-[#1C1C1C] placeholder:text-[#6B6B6B] border border-transparent focus:outline-none focus:ring-2 focus:ring-dv-green"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dv-text mb-1">
              CNPJ *
            </label>
            <input
              type="text"
              value={formData.ep_cnpj}
              onChange={(e) => setFormData({ ...formData, ep_cnpj: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#EBEBEB] text-[#1C1C1C] placeholder:text-[#6B6B6B] border border-transparent focus:outline-none focus:ring-2 focus:ring-dv-green"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setCreateModalOpen(false);
                setFormData({ nm_enterprise: '', ep_fantasy: '', ep_cnpj: '' });
              }}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              Criar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

