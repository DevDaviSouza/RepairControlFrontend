import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components';
import { Table, TableRow, TableCell } from '@/components';
import { Loading } from '@/components';
import { Pagination } from '@/components';
import { Modal } from '@/components';
import { customersService } from '@/services/CustomersService';
import { useToast } from '@/hooks/useToast';
import type { Customer } from '@/types';

export const CustomersList = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<number | null>(null);
  const itemsPerPage = 10;
  const { showToast } = useToast();

  useEffect(() => {
    loadCustomers();
  }, [currentPage]);

  const loadCustomers = async () => {
    try {
      setIsLoading(true);
      const response = await customersService.findAll({
        page: currentPage - 1,
        limit: itemsPerPage,
      });
      setCustomers(response.items);
      setTotalItems(response.totalItems);
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Erro ao carregar clientes', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!customerToDelete) return;

    try {
      await customersService.delete(customerToDelete);
      showToast('Cliente excluído com sucesso', 'success');
      setDeleteModalOpen(false);
      setCustomerToDelete(null);
      loadCustomers();
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Erro ao excluir cliente', 'error');
    }
  };

  const openDeleteModal = (id: number) => {
    setCustomerToDelete(id);
    setDeleteModalOpen(true);
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (isLoading && customers.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className="text-dv-text">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-dv-text">Clientes</h1>
        <Link to="/customers/new">
          <Button variant="primary">Novo Cliente</Button>
        </Link>
      </div>

      <div className="rounded-2xl">
        <Table
          headers={['ID', 'Nome', 'CPF', 'Telefone', 'Email', 'Ações']}
        >
          {customers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-dv-textMuted">
                Nenhum cliente encontrado
              </TableCell>
            </TableRow>
          ) : (
            customers.map((customer) => (
              <TableRow key={customer.customers_id}>
                <TableCell>{customer.customers_id}</TableCell>
                <TableCell>{customer.nm_customer || '-'}</TableCell>
                <TableCell>{customer.nm_cpf || '-'}</TableCell>
                <TableCell>{customer.ds_phone || '-'}</TableCell>
                <TableCell>{customer.ds_mail || '-'}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Link to={`/customers/${customer.customers_id}/edit`}>
                      <Button variant="secondary" className="text-xs py-1 px-2">
                        Editar
                      </Button>
                    </Link>
                    <Button
                      variant="danger"
                      className="text-xs py-1 px-2"
                      onClick={() => openDeleteModal(customer.customers_id)}
                    >
                      Excluir
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
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
          setCustomerToDelete(null);
        }}
        title="Confirmar Exclusão"
      >
        <p className="mb-4">Tem certeza que deseja excluir este cliente?</p>
        <div className="flex justify-end gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              setDeleteModalOpen(false);
              setCustomerToDelete(null);
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

