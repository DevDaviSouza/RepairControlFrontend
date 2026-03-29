import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components';
import { Loading } from '@/components';
import { ordersService } from '@/services/OrdersService';
import { paymentsService } from '@/services/PaymentsService';
import { statusOrderService } from '@/services/StatusOrderService';
import { useToast } from '@/hooks/useToast';
import { format } from 'date-fns';
import type { Order } from '@/types';

export const Dashboard = () => {
  const [delayedCount, setDelayedCount] = useState(0);
  const [pendingPainting, setPendingPainting] = useState(0);
  const [proxLate, setProxLate] = useState<any[]>([]);
  const [deliveryItems, setDeliveryItems] = useState(0);
  const [totalPayments, setTotalPayments] = useState(0);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [statusById, setStatusById] = useState<Map<number, string>>(new Map());
  const [flowRange, setFlowRange] = useState<'day' | 'month'>('month');
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadOrdersForFlow = async () => {
    const limit = 100;
    const maxPages = 10;
    let page = 0;
    let totalItems = 0;
    const items: Order[] = [];

    do {
      const response = await ordersService.findAll({ page, limit });
      const pageItems = Array.isArray(response.items) ? response.items : [];
      items.push(...pageItems);
      totalItems = Number(response.totalItems || 0);
      page += 1;
    } while (items.length < totalItems && page < maxPages);

    return items;
  };

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
      const [ordersResult, statusesResult] = await Promise.allSettled([
        loadOrdersForFlow(),
        statusOrderService.findAll(),
      ]);

      const orders = ordersResult.status === 'fulfilled' ? ordersResult.value ?? [] : [];
      const statuses = statusesResult.status === 'fulfilled' ? statusesResult.value ?? [] : [];

      setAllOrders(Array.isArray(orders) ? orders : []);

      const statusMap = new Map<number, string>();
      if (Array.isArray(statuses)) {
        statuses.forEach((status) => {
          if (status.status_id) {
            statusMap.set(status.status_id, status.ds_status);
          }
        });
      }
      setStatusById(statusMap);

      if (ordersResult.status === 'rejected' && statusesResult.status === 'rejected') {
        showToast('Alguns dados do grafico nao puderam ser carregados', 'error');
      }
    } catch (error) {
      showToast('Erro ao carregar dados do dashboard', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDateBR = (value: string | null) => {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '-';
    return format(date, 'dd/MM/yyyy');
  };

  const flowData = useMemo(() => {
    const now = new Date();

    const isInRange = (dateValue: string | null) => {
      if (!dateValue) return false;
      const date = new Date(dateValue);
      if (Number.isNaN(date.getTime())) return false;

      if (flowRange === 'day') {
        return (
          date.getFullYear() === now.getFullYear() &&
          date.getMonth() === now.getMonth() &&
          date.getDate() === now.getDate()
        );
      }

      return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
    };

    let entrada = 0;
    let analise = 0;
    let processo = 0;
    let saida = 0;

    allOrders.forEach((order) => {
      const statusName = order.status_id ? statusById.get(order.status_id) || '' : '';

      if (isInRange(order.dt_order)) {
        entrada += 1;

        if (statusName === 'ORCAMENTO' || statusName === 'APROVADO') {
          analise += 1;
        }

        if (statusName === 'ANDAMENTO' || statusName === 'AGUARDANDO_PECA') {
          processo += 1;
        }
      }

      if (order.bt_delivered && isInRange(order.dt_delivered)) {
        saida += 1;
      }
    });

    const bars = [
      { label: 'Entrada', value: entrada, tone: 'bg-[#6E7EA8]' },
      { label: 'Analise', value: analise, tone: 'bg-[#8394C2]' },
      { label: 'Processo', value: processo, tone: 'bg-[#B68A8F]' },
      { label: 'Saida', value: saida, tone: 'bg-[#7AAE93]' },
    ];

    const maxValue = Math.max(...bars.map((item) => item.value), 1);

    return {
      bars,
      maxValue,
      entrada,
      processo,
      saida,
    };
  }, [allOrders, statusById, flowRange]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-dv-border bg-gradient-to-r from-dv-surface to-dv-backgroundSoft p-6 md:p-8 shadow-card-dark">
        <h1 className="font-display text-4xl md:text-5xl leading-none text-white">DASHBOARD</h1>
        <p className="mt-3 text-dv-textMuted max-w-2xl">
          Visualize indicadores operacionais e financeiro em tempo real.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card className="border-dv-red/50">
          <div className="text-xs uppercase tracking-[0.14em] text-dv-textSoft mb-2">Atrasadas</div>
          <div className="text-4xl font-display font-bold text-white">{delayedCount}</div>
          <Link to="/orders?filter=late" className="text-dv-red text-sm mt-3 inline-block hover:underline">
            Ver detalhes
          </Link>
        </Card>

        <Card className="border-dv-gold/50">
          <div className="text-xs uppercase tracking-[0.14em] text-dv-textSoft mb-2">Pendentes de pintura</div>
          <div className="text-4xl font-display font-bold text-white">{pendingPainting}</div>
        </Card>

        <Card className="border-dv-blue/50">
          <div className="text-xs uppercase tracking-[0.14em] text-dv-textSoft mb-2">Pecas entregues (mes)</div>
          <div className="text-4xl font-display font-bold text-white">{deliveryItems}</div>
        </Card>

        <Card className="border-dv-green/50">
          <div className="text-xs uppercase tracking-[0.14em] text-dv-textSoft mb-2">Total recebido</div>
          <div className="text-4xl font-display font-bold text-white">
            R$ {totalPayments.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
        </Card>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-5">
        <Card className="border-dv-border/80">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-3xl leading-none text-white">Fluxo de Reparos</h2>
              <p className="text-dv-textSoft mt-2">Media de processamento por estagio</p>
            </div>
            <div className="inline-flex rounded-lg border border-dv-border overflow-hidden">
              <button
                onClick={() => setFlowRange('day')}
                className={`px-3 py-1.5 text-xs font-semibold tracking-[0.08em] uppercase transition-colors ${
                  flowRange === 'day' ? 'bg-dv-surfaceAlt text-white' : 'bg-transparent text-dv-textSoft hover:text-white'
                }`}
              >
                Dia
              </button>
              <button
                onClick={() => setFlowRange('month')}
                className={`px-3 py-1.5 text-xs font-semibold tracking-[0.08em] uppercase transition-colors ${
                  flowRange === 'month' ? 'bg-[#E9A7A7] text-[#2D1B1B]' : 'bg-transparent text-dv-textSoft hover:text-white'
                }`}
              >
                Mes
              </button>
            </div>
          </div>

          <div className="mt-6 h-72 rounded-xl border border-dv-border/60 bg-dv-backgroundSoft/60 px-4 md:px-6 py-5 flex items-end gap-3 md:gap-4">
            {flowData.bars.map((bar) => {
              const heightPercent = Math.max((bar.value / flowData.maxValue) * 100, bar.value > 0 ? 12 : 2);

              return (
                <div key={bar.label} className="flex-1 flex flex-col justify-end h-full">
                  <div className="text-center text-xs text-dv-textMuted mb-2">{bar.value}</div>
                  <div
                    className={`w-full ${bar.tone} rounded-t-lg transition-all duration-300`}
                    style={{ height: `${heightPercent}%` }}
                    title={`${bar.label}: ${bar.value}`}
                  />
                  <div className="mt-2 text-center text-[11px] uppercase tracking-[0.12em] text-dv-textSoft">{bar.label}</div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-dv-border/70 bg-dv-backgroundSoft px-4 py-3">
              <div className="text-[11px] uppercase tracking-[0.14em] text-dv-textSoft">Entrada</div>
              <div className="text-2xl font-display text-white mt-1">{flowData.entrada}</div>
            </div>
            <div className="rounded-xl border border-dv-border/70 bg-dv-backgroundSoft px-4 py-3">
              <div className="text-[11px] uppercase tracking-[0.14em] text-dv-textSoft">Processo</div>
              <div className="text-2xl font-display text-white mt-1">{flowData.processo}</div>
            </div>
            <div className="rounded-xl border border-dv-border/70 bg-dv-backgroundSoft px-4 py-3">
              <div className="text-[11px] uppercase tracking-[0.14em] text-dv-textSoft">Saida</div>
              <div className="text-2xl font-display text-white mt-1">{flowData.saida}</div>
            </div>
          </div>
        </Card>

        <Card title="Leitura do Fluxo">
          <div className="space-y-3 text-sm text-dv-textMuted">
            <p>
              O grafico usa ordens do periodo selecionado ({flowRange === 'day' ? 'dia atual' : 'mes atual'}).
            </p>
            <p>
              Entrada considera data do pedido, processo considera ordens em andamento e saida considera ordens entregues.
            </p>
            <p className="text-dv-textSoft">Base atual carregada: {allOrders.length} ordens.</p>
          </div>
        </Card>
      </section>

      {proxLate.length > 0 && (
        <Card title="Ordens proximas do prazo (2 dias)">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-dv-border">
              <thead className="bg-dv-surfaceAlt/80">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-dv-textMuted uppercase tracking-[0.14em]">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-dv-textMuted uppercase tracking-[0.14em]">
                    Modelo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-dv-textMuted uppercase tracking-[0.14em]">
                    Placa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-dv-textMuted uppercase tracking-[0.14em]">
                    Data conclusao
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dv-border/70">
                {proxLate.map((order) => (
                  <tr key={order.order_id} className="hover:bg-dv-surfaceAlt/40 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-dv-text">#{order.order_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-dv-text">{order.ds_model}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-dv-text">{order.ds_plate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-dv-text">
                      {formatDateBR(order.dt_completion)}
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
