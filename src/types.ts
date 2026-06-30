export interface Investment {
  id: string;
  amount: number;
  expectedReturn: number;
  startedAt: number; // timestamp ms
  endsAt: number; // timestamp ms
  completed: boolean;
  claimed: boolean;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'investment' | 'payout' | 'withdrawal';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  timestamp: number;
  details: string;
}

export interface PlatformStats {
  totalDeposited: number;
  totalInvested: number;
  totalWithdrawn: number;
  totalEarned: number;
}
