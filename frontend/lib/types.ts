export interface Subscription {
  id: number;
  subscriber: string;
  creator: string;
  paymentToken: string;
  amount: string;
  interval: number;
  nextPaymentDue: number;
  isActive: boolean;
  startTime: number;
}

export interface Creator {
  address: string;
  name: string;
  description: string;
  monthlyPrice: string;
  subscribers: number;
  category: string;
  totalRevenue?: string;
}

export interface RefundPolicy {
  refundWindowDays: number;
  refundPercentage: number;
  isActive: boolean;
}

export interface RefundRequest {
  subscriptionId: number;
  subscriber: string;
  creator: string;
  token: string;
  amount: string;
  requestTime: number;
  status: RefundStatus;
}

export enum RefundStatus {
  Pending = 0,
  Approved = 1,
  Rejected = 2,
  Processed = 3,
}

export interface VaultBalance {
  totalBalance: string;
  lockedBalance: string;
  availableBalance: string;
}

export interface PaymentToken {
  address: string;
  symbol: string;
  decimals: number;
  name: string;
}


