import React from 'react';
import { History, ArrowDownLeft, ArrowUpRight, Flame, ShieldCheck, HelpCircle } from 'lucide-react';
import { Transaction } from '../types';
import { motion } from 'motion/react';

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export default function TransactionHistory({ transactions }: TransactionHistoryProps) {
  const formatMoney = (val: number) => {
    return '₦' + val.toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  };

  const getIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className="w-4 h-4 text-emerald-400" />;
      case 'investment':
        return <Flame className="w-4 h-4 text-orange-400 animate-pulse" />;
      case 'payout':
        return <ArrowUpRight className="w-4 h-4 text-emerald-400" />;
      case 'withdrawal':
        return <ArrowUpRight className="w-4 h-4 text-red-400" />;
    }
  };

  const getBadgeStyle = (type: Transaction['type']) => {
    switch (type) {
      case 'deposit':
        return 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/15';
      case 'investment':
        return 'bg-orange-950/40 text-orange-400 border border-orange-500/15';
      case 'payout':
        return 'bg-emerald-950/80 text-emerald-400 border border-emerald-400/30';
      case 'withdrawal':
        return 'bg-red-950/40 text-red-400 border border-red-500/15';
    }
  };

  const getLabel = (type: Transaction['type']) => {
    switch (type) {
      case 'deposit':
        return 'Deposit';
      case 'investment':
        return 'Multiplier Lock';
      case 'payout':
        return '2x Maturity Payout';
      case 'withdrawal':
        return 'Cash Out';
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 relative overflow-hidden" id="transaction-history">
      <div className="absolute top-0 right-0 w-24 h-24 bg-zinc-900/50 rounded-full blur-2xl -mr-6 -mt-6"></div>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-400" />
            Transaction History
          </h2>
          <p className="text-zinc-400 text-xs mt-1">Audit trail of all wallet fundings, contract lockups, and payouts.</p>
        </div>
        
        <span className="text-[10px] font-mono text-zinc-500 bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1">
          Total logs: {transactions.length}
        </span>
      </div>

      <div className="overflow-x-auto">
        {transactions.length === 0 ? (
          <div className="py-12 text-center border border-dashed border-zinc-800 rounded-xl bg-zinc-950/20">
            <History className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
            <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400">No Transaction History</h4>
            <p className="text-[10px] text-zinc-500 max-w-xs mx-auto mt-1">
              Your logs will record here when you deposit funds, lock in an investment, or cash out.
            </p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                <th className="py-3 px-4">Transaction / Date</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Details</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/40 text-xs sm:text-sm">
              {transactions
                .slice()
                .sort((a, b) => b.timestamp - a.timestamp)
                .map((tx) => (
                  <tr key={tx.id} className="hover:bg-zinc-900/25 transition-colors group">
                    {/* Timestamp */}
                    <td className="py-3.5 px-4">
                      <div className="font-sans font-medium text-white">{new Date(tx.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                      <div className="text-[10px] font-mono text-zinc-500">
                        {new Date(tx.timestamp).toLocaleTimeString('en-US', { hour12: false, hour: 'numeric', minute: '2-digit', second: '2-digit' })}
                      </div>
                    </td>

                    {/* Badge */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <div className={`p-1 rounded-md ${getBadgeStyle(tx.type)}`}>
                          {getIcon(tx.type)}
                        </div>
                        <span className={`text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${getBadgeStyle(tx.type)}`}>
                          {getLabel(tx.type)}
                        </span>
                      </div>
                    </td>

                    {/* Details */}
                    <td className="py-3.5 px-4 text-zinc-400 font-sans max-w-[200px] truncate" title={tx.details}>
                      {tx.details}
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 text-right font-mono font-bold whitespace-nowrap">
                      <span className={tx.type === 'deposit' || tx.type === 'payout' ? 'text-emerald-400' : tx.type === 'withdrawal' ? 'text-red-400' : 'text-orange-400'}>
                        {tx.type === 'deposit' || tx.type === 'payout' ? '+' : '-'} {formatMoney(tx.amount)}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-lg border uppercase ${
                        tx.status === 'completed'
                          ? 'bg-emerald-950/20 text-emerald-400 border-emerald-500/20'
                          : tx.status === 'pending'
                          ? 'bg-yellow-950/20 text-yellow-400 border-yellow-500/20'
                          : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
