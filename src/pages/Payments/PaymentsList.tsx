import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components';
import { Table, TableRow, TableCell } from '@/components';
import { Loading } from '@/components';
import { Modal } from '@/components';
import { Button } from '@/components';
import { paymentsService } from '@/services/PaymentsService';
import { useToast } from '@/hooks/useToast';
import type { Payment } from '@/types';

export const PaymentsList = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [totalPayments, setTotalPayments] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState<number | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    loadPayments();
    loadTotalPayments();
  }, []);

  const loadPayments = async () => {
    try {
      setIsLoading(true);
      const data = await paymentsService.findAll();
      setPayments(data);
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Erro ao carregar pagamentos', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const loadTotalPayments = async () => {
    try {
      const data = await paymentsService.findTotal();
      setTotalPayments(Number(data._sum.vl_payment || 0));
    } catch (error: any) {
      showToast('Erro ao carregar total de pagamentos', 'error');
    }
  };

  const handleDelete = async () => {
    if (!paymentToDelete) return;

    try {
      await paymentsService.delete(paymentToDelete);
      showToast('Pagamento excluido com sucesso', 'success');
      setDeleteModalOpen(false);
      setPaymentToDelete(null);
      loadPayments();
      loadTotalPayments();
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Erro ao excluir pagamento', 'error');
    }
  };

  const openDeleteModal = (id: number) => {
    setPaymentToDelete(id);
    setDeleteModalOpen(true);
  };

  if (isLoading) {
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
          <h1 className="font-display text-5xl leading-none text-white">PAGAMENTOS</h1>
          <p className="mt-3 text-dv-textMuted">Controle completo dos recebimentos por ordem de servico.</p>
        </div>
        <Link to="/payments/select-order">
          <Button variant="success" className="w-full lg:w-auto px-6 py-3">Novo Pagamento</Button>
        </Link>
      </section>

      <Card className="border-dv-green/40">
        <div className="text-xs uppercase tracking-[0.14em] text-dv-textMuted mb-2">Total recebido</div>
        <div className="font-display text-5xl font-bold text-dv-lime">
          R$ {totalPayments.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </div>
      </Card>

      <div>
        <Table headers={['ID', 'Ordem ID', 'Valor Total', 'Valor Pago', 'Valor Restante', 'Acoes']}>
          {payments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-12 text-dv-textMuted">
                Nenhum pagamento encontrado
              </TableCell>
            </TableRow>
          ) : (
            payments.map((payment) => (
              <TableRow key={payment.payment_id}>
                <TableCell>{payment.payment_id}</TableCell>
                <TableCell>
                  <Link to={`/orders/${payment.order_id}`} className="text-dv-lime hover:underline">
                    #{payment.order_id}
                  </Link>
                </TableCell>
                <TableCell>
                  {payment.vl_total
                    ? `R$ ${Number(payment.vl_total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                    : '-'}
                </TableCell>
                <TableCell>
                  {payment.vl_payment
                    ? `R$ ${Number(payment.vl_payment).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                    : '-'}
                </TableCell>
                <TableCell>
                  {payment.vl_reamining
                    ? `R$ ${Number(payment.vl_reamining).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                    : '-'}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Link to={`/payments/${payment.order_id}/new`}>
                      <Button variant="secondary" className="text-xs py-1 px-3">
                        Adicionar Valor
                      </Button>
                    </Link>
                    <Button
                      variant="danger"
                      className="text-xs py-1 px-3"
                      onClick={() => openDeleteModal(payment.payment_id)}
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

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setPaymentToDelete(null);
        }}
        title="Confirmar Exclusao"
      >
        <p className="mb-4">Tem certeza que deseja excluir este pagamento?</p>
        <div className="flex justify-end gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              setDeleteModalOpen(false);
              setPaymentToDelete(null);
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
