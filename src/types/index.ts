// Customer Types
export interface Customer {
  customers_id: number;
  nm_customer: string | null;
  ds_phone: string | null;
  ds_mail: string | null;
  nm_cpf: string | null;
}

export interface CustomerFormData {
  name: string;
  phone: string;
  email: string;
  cpf: string;
}

export interface CustomerResponse {
  items: Customer[];
  totalItems: number;
}

// Enterprise Types
export interface Enterprise {
  enterprise_id: number;
  nm_enterprise: string | null;
  ep_fantasy: string | null;
  ep_cnpj: string | null;
}

export interface EnterpriseFormData {
  nm_enterprise: string;
  ep_fantasy: string;
  ep_cnpj: string;
}

// User Types
export interface User {
  user_id: number;
  nm_user: string | null;
  ds_email: string | null;
  ds_senha: string | null;
  enterprise_id: number | null;
}

// Priority Types
export type PriorityEnum = 'BAIXA' | 'MEDIA' | 'ALTA';

export interface Priority {
  priority_id: number;
  ds_priority: PriorityEnum;
}

export interface PriorityFormData {
  ds_priority: PriorityEnum;
}

// Status Order Types
export type StatusOrderEnum = 
  | 'RECEBIDO' 
  | 'ORCAMENTO' 
  | 'APROVADO' 
  | 'ANDAMENTO' 
  | 'AGUARDANDO_PECA' 
  | 'FINALIZADO' 
  | 'ENTREGUE';

export interface StatusOrder {
  status_id: number;
  ds_status: StatusOrderEnum;
}

export interface StatusOrderFormData {
  status: StatusOrderEnum;
}

// Order Types
export interface Order {
  order_id: number;
  customer_id: number | null;
  ds_model: string | null;
  ds_color: string | null;
  dt_year: number | null;
  ds_plate: string | null;
  qtd_repair: number | null;
  qtd_painting: number | null;
  dt_order: string | null;
  dt_completion: string | null;
  dt_delivered: string | null;
  bt_delivered: boolean | null;
  ds_services: string | null;
  status_id: number | null;
  priority_id: number | null;
  vl_total: number | null;
  enterprise_id: number | null;
}

export interface OrderFormData {
  customerId: number;
  dsModel: string;
  dsColor: string;
  dtYear: number;
  dsPlate: string;
  qtdRepair: number;
  qtdPainting: number;
  dtOrder: string;
  dtCompletion: string;
  dsServices: string;
  priorityId: number;
  vlTotal: number;
  enterpriseId: number;
}

export interface OrderResponse {
  items: Order[];
  totalItems: number;
}

export interface ChangeStatusData {
  status: number;
}

export interface AlterCompletionDateData {
  dtCompletion: string;
}

// Payment Types
export interface Payment {
  payment_id: number;
  order_id: number;
  vl_total: number | null;
  vl_payment: number | null;
  vl_reamining: number | null;
  ds_payment: string | null;
}

export interface PaymentFormData {
  payment: number;
}

export interface TotalPaymentsResponse {
  _sum: {
    vl_payment: number | null;
  };
  _count: {
    payment_id: number;
  };
}

// Pagination Types
export interface PaginationParams {
  page?: number;
  limit?: number;
}

// API Response Types
export interface ApiResponse<T = any> {
  message?: string;
  data?: T;
  [key: string]: any;
}

