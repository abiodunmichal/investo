import React from 'react';
import { Wallet, ArrowDownLeft, TrendingUp, CreditCard, Flame, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';

interface WalletStatsProps {
  walletBalance: number;
  activeInvestmentsCount: number;
  totalInvestedAmount: number;
  totalEarnedAmount: number;
  totalWithdrawnAmount: number;
}

export default function WalletStats({
  walletBalance,
  activeInvestmentsCount,
  totalInvestedAmount,
  totalEarnedAmount,
  totalWithdrawnAmount,
}: WalletStatsProps) {
  const formatMoney = (val: number) => {
    return '₦' + val.toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {/* WALLET BALANCE - HERO CARD */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="md:col-span-2 relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-zinc-900 to-black border border-emerald-500/30 shadow-[0_4px_30px_rgba(16,185,129,0.15)] glow-green"
      >
        {/* Futuristic Background Accents */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-green-500/5 rounded-full blur-2xl -ml-10 -mb-10"></div>
        
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-xs font-mono tracking-widest text-emerald-400 uppercase font-semibold">Available Funds</p>
            <h3 className="text-sm font-sans text-zinc-400 mt-0.5">Wallet Balance</h3>
          </div>
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/20 text-emerald-400">
            <Wallet className="w-6 h-6" />
          </div>
        </div>
        
        <div className="mt-2">
          <span className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight glow-text">
            {formatMoney(walletBalance)}
          </span>
          <div className="flex items-center gap-1.5 mt-3 text-xs font-mono text-emerald-400 bg-emerald-950/40 w-fit px-2.5 py-1 rounded-full border border-emerald-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            100% Secure & Liquid
          </div>
        </div>
      </motion.div>

      {/* ACTIVE MULTIPLIERS */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="rounded-2xl p-6 bg-zinc-900/60 border border-zinc-800 backdrop-blur-md relative overflow-hidden"
      >
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="text-xs font-mono tracking-widest text-orange-400 uppercase font-semibold">In Progress</p>
            <h3 className="text-sm font-sans text-zinc-400 mt-0.5">Active Multipliers</h3>
          </div>
          <div className="p-2.5 rounded-xl bg-orange-950/40 border border-orange-500/20 text-orange-400">
            <Flame className="w-5 h-5 animate-bounce" />
          </div>
        </div>
        <div className="mt-4">
          <span className="font-display font-bold text-2xl text-white">
            {activeInvestmentsCount}
          </span>
          <p className="text-xs font-mono text-zinc-400 mt-1">
            Invested: {formatMoney(totalInvestedAmount)}
          </p>
        </div>
      </motion.div>

      {/* TOTAL EARNINGS */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="rounded-2xl p-6 bg-zinc-900/60 border border-zinc-800 backdrop-blur-md relative overflow-hidden"
      >
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="text-xs font-mono tracking-widest text-emerald-400 uppercase font-semibold">Total Payouts</p>
            <h3 className="text-sm font-sans text-zinc-400 mt-0.5">Total Doubled</h3>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-emerald-400">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4">
          <span className="font-display font-bold text-2xl text-emerald-400">
            {formatMoney(totalEarnedAmount)}
          </span>
          <p className="text-xs font-mono text-zinc-400 mt-1">
            Withdrawn: {formatMoney(totalWithdrawnAmount)}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
