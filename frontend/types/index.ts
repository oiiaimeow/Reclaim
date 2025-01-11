export interface Subscription {
  id: string;
  subscriber: string;
  creator: string;
  paymentToken: string;
  amount: bigint;
  interval: number;
  nextPaymentDue: number;
  isActive: boolean;
  startTime: number;
}

export interface RefundRequest {
  id: string;
  subscriptionId: string;
  subscriber: string;
  creator: string;
  token: string;
  amount: bigint;
  requestTime: number;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Processed';
}

export interface CreatorStats {
  totalSubscribers: number;
  activeSubscribers: number;
  monthlyRevenue: bigint;
  totalRevenue: bigint;
}

export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
}

export interface Network {
  id: number;
  name: string;
  rpcUrl: string;
  blockExplorer: string;
}

