import React, { useState } from 'react';
import { 
  Lock, 
  Unlock, 
  CheckCircle2, 
  XCircle, 
  TrendingUp, 
  Clock, 
  Wallet, 
  ArrowUpRight, 
  ShieldAlert, 
  Flame, 
  Smartphone, 
  ArrowDownLeft,
  Check,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Transaction, Investment } from '../types';

interface AdminPortalProps {
  transactions: Transaction[];
  activeInvestments: Investment[];
  walletBalance: number;
  onApproveDeposit: (txId: string, autoInvest: boolean) => void;
  onRejectDeposit: (txId: string) => void;
  onApproveWithdrawal: (txId: string) => void;
  onForceMatureInvestment: (id: string) => void;
}

export default function AdminPortal({
  transactions,
  activeInvestments,
  walletBalance,
  onApproveDeposit,
  onRejectDeposit,
  onApproveWithdrawal,
  onForceMatureInvestment,
}: AdminPortalProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passcode, setPasscode] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const defaultPasscode = '1234';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === defaultPasscode) {
      setIsAuthenticated(true);
      setError(null);
    } else {
      setError('Invalid admin passcode. Hint: Use 1234');
    }
  };

  const handleBypass = () => {
    setIsAuthenticated(true);
    setError(null);
  };

  const formatMoney = (val: number) => {
    return '₦' + val.toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  };

  // Filter pending transactions
  const pendingDeposits = transactions.filter(t => t.type === 'deposit' && t.status === 'pending');
  const pendingWithdrawals = transactions.filter(t => t.type === 'withdrawal' && t.status === 'pending');
  const activeContracts = activeInvestments.filter(i => !i.completed);

  // Stats calculations
  const totalPendingDepositsSum = pendingDeposits.reduce((sum, tx) => sum + tx.amount, 0);
  const totalPendingWithdrawalsSum = pendingWithdrawals.reduce((sum, tx) => sum + tx.amount, 0);
  const totalActiveMultiplierVolume = activeContracts.reduce((sum, inv) => sum + inv.amount, 0);

  if (!isAuthenticated) {
    return (
      <div className="glass-card rounded-2xl p-8 max-w-md mx-auto text-center relative overflow-hidden my-6 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.05)]">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl -mr-6 -mt-6"></div>
        
        <div className="w-14 h-14 rounded-full bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-4 animate-pulse">
          <Lock className="w-6 h-6" />
        </div>

        <h2 className="font-display font-bold text-2xl text-white">Admin Secure Node</h2>
        <p className="text-zinc-400 text-xs mt-1 mb-6">Enter your administrative passcode to verify pending transfers, payouts, and multiplier contracts.</p>

        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-500 font-semibold">
              Admin Gate Passcode
            </label>
            <input
              type="password"
              className="block w-full rounded-xl border border-zinc-800 bg-zinc-950/70 py-3 px-4 text-white placeholder-zinc-700 text-center font-mono tracking-widest text-lg focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="••••"
              maxLength={6}
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="text-xs text-red-400 font-mono text-center flex items-center gap-1 justify-center">
              <ShieldAlert className="w-3.5 h-3.5" />
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-black font-bold text-sm tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_4px_15px_rgba(34,197,94,0.15)]"
          >
            Authenticate Node
            <Unlock className="w-4 h-4" />
          </button>
        </form>

        <div className="relative flex py-3 items-center">
          <div className="flex-grow border-t border-zinc-800/80"></div>
          <span className="flex-shrink mx-4 text-[10px] font-mono text-zinc-600 uppercase">Demo Quick Pass</span>
          <div className="flex-grow border-t border-zinc-800/80"></div>
        </div>

        <button
          onClick={handleBypass}
          className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-emerald-500/30 text-zinc-400 hover:text-emerald-400 text-xs font-mono tracking-wider transition-all"
        >
          Instant Bypass (Demo/Test)
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6" id="admin-panel">
      {/* ADMIN INTRO HEADER */}
      <div className="p-4 rounded-xl bg-zinc-900/90 border border-emerald-500/30 backdrop-blur-md relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Unlock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display font-bold text-lg text-white flex items-center gap-2">
              Platform Admin Site
              <span className="text-[9px] font-mono uppercase bg-emerald-950 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded">Root Node</span>
            </h2>
            <p className="text-xs text-zinc-400">You are logged into the OPay Manual Settlement and Multiplier Node for Abiodun Michael.</p>
          </div>
        </div>
        <button
          onClick={() => setIsAuthenticated(false)}
          className="text-xs font-mono px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-red-400 hover:border-red-500/30 transition-all shrink-0"
        >
          Lock Admin Panel
        </button>
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
          <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">User Wallet Balance</p>
          <h4 className="text-xl font-display font-bold text-white mt-1">{formatMoney(walletBalance)}</h4>
          <span className="text-[9px] font-mono text-zinc-500 block mt-1">Direct client liability</span>
        </div>
        <div className="p-4 rounded-xl bg-zinc-950 border border-emerald-500/20">
          <p className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">Pending Deposits</p>
          <h4 className="text-xl font-display font-bold text-emerald-400 mt-1">{formatMoney(totalPendingDepositsSum)}</h4>
          <span className="text-[9px] font-mono text-zinc-400 block mt-1">{pendingDeposits.length} transfers to verify</span>
        </div>
        <div className="p-4 rounded-xl bg-zinc-950 border border-orange-500/20">
          <p className="text-[10px] font-mono text-orange-400 uppercase tracking-wider">Active Doubler Volume</p>
          <h4 className="text-xl font-display font-bold text-orange-400 mt-1">{formatMoney(totalActiveMultiplierVolume)}</h4>
          <span className="text-[9px] font-mono text-zinc-400 block mt-1">{activeContracts.length} timers multiplying</span>
        </div>
        <div className="p-4 rounded-xl bg-zinc-950 border border-red-500/20">
          <p className="text-[10px] font-mono text-red-400 uppercase tracking-wider">Pending Cash Outs</p>
          <h4 className="text-xl font-display font-bold text-red-400 mt-1">{formatMoney(totalPendingWithdrawalsSum)}</h4>
          <span className="text-[9px] font-mono text-zinc-400 block mt-1">{pendingWithdrawals.length} payouts to make manually</span>
        </div>
      </div>

      {/* DETAILED WORKING SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* PENDING DEPOSITS QUEUE */}
        <div className="lg:col-span-7 glass-card rounded-2xl p-6 relative overflow-hidden space-y-4">
          <div>
            <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
              <ArrowDownLeft className="w-5 h-5 text-emerald-400" />
              Deposit Verification Portal
            </h3>
            <p className="text-xs text-zinc-400">Review user-submitted fundings. Approve to credit balance or immediately trigger the 2-hour doubling multiplier contract.</p>
          </div>

          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
            <AnimatePresence mode="popLayout">
              {pendingDeposits.length === 0 ? (
                <div className="py-12 text-center border border-dashed border-zinc-800 rounded-xl bg-zinc-950/20">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400/80 mx-auto mb-2" />
                  <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-300">All Deposits Settled</h4>
                  <p className="text-[10px] text-zinc-500 max-w-xs mx-auto mt-1">
                    No pending deposit confirmation requests are waiting for approval.
                  </p>
                </div>
              ) : (
                pendingDeposits.map((tx) => (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-emerald-500/20 transition-all space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono text-zinc-500">{tx.id}</span>
                          <span className="text-[9px] font-mono uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-500/10">Pending Approval</span>
                        </div>
                        <h4 className="font-display font-extrabold text-xl text-emerald-400 mt-1">{formatMoney(tx.amount)}</h4>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500">
                        {new Date(tx.timestamp).toLocaleTimeString('en-US', { hour12: false })}
                      </span>
                    </div>

                    <p className="text-xs font-sans text-zinc-400 bg-zinc-900/60 p-2 rounded-lg border border-zinc-800/40 line-clamp-2">
                      {tx.details}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                      {/* Action Option 1: Start doubling immediately */}
                      <button
                        onClick={() => onApproveDeposit(tx.id, true)}
                        className="py-2 px-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center justify-center gap-1 shadow-[0_2px_8px_rgba(34,197,94,0.15)] transition-all"
                        title="Directly start multiplying the money"
                      >
                        <Flame className="w-3.5 h-3.5 fill-current shrink-0" />
                        Approve & Start Doubling
                      </button>

                      {/* Action Option 2: Add to balance only */}
                      <button
                        onClick={() => onApproveDeposit(tx.id, false)}
                        className="py-2 px-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-emerald-400 border border-zinc-800 hover:border-emerald-500/30 font-semibold text-xs flex items-center justify-center gap-1 transition-all"
                        title="Add to their general balance"
                      >
                        <Wallet className="w-3.5 h-3.5 shrink-0" />
                        Approve to Balance
                      </button>

                      {/* Action Option 3: Reject */}
                      <button
                        onClick={() => onRejectDeposit(tx.id)}
                        className="py-2 px-2.5 rounded-lg bg-zinc-900 hover:bg-red-950/30 text-zinc-500 hover:text-red-400 border border-zinc-800 hover:border-red-500/20 text-xs flex items-center justify-center gap-1 transition-all"
                      >
                        <XCircle className="w-3.5 h-3.5 shrink-0" />
                        Decline
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* PENDING WITHDRAWALS & ACTIVE TIMERS */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* PENDING CASH OUTS (MANUAL PAYMENT CONFIRMATION) */}
          <div className="glass-card rounded-2xl p-6 relative overflow-hidden space-y-4">
            <div>
              <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
                <ArrowUpRight className="w-5 h-5 text-red-400" />
                Manual Payout Queue
              </h3>
              <p className="text-xs text-zinc-400">Verifiably deducts user balance. Transfer the funds using your OPay app to the recipient bank listed below, then mark as Paid.</p>
            </div>

            <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
              <AnimatePresence mode="popLayout">
                {pendingWithdrawals.length === 0 ? (
                  <div className="py-6 text-center border border-dashed border-zinc-800 rounded-xl bg-zinc-950/20">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400/80 mx-auto mb-1.5" />
                    <h4 className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">No Pending Payouts</h4>
                  </div>
                ) : (
                  pendingWithdrawals.map((tx) => (
                    <motion.div
                      key={tx.id}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2.5"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono text-zinc-500">{tx.id}</span>
                        <span className="font-mono font-bold text-red-400">{formatMoney(tx.amount)}</span>
                      </div>

                      <div className="text-[11px] font-mono text-zinc-400 bg-zinc-900 p-2 rounded border border-zinc-800/50 space-y-1">
                        {tx.details.split('Withdrawn to ').map((d, i) => i === 1 ? (
                          <div key={i} className="text-white font-medium text-xs font-sans leading-relaxed">
                            {d}
                          </div>
                        ) : null)}
                      </div>

                      <button
                        onClick={() => onApproveWithdrawal(tx.id)}
                        className="w-full py-2 px-3 rounded-lg bg-red-950/30 hover:bg-red-500 text-red-400 hover:text-black border border-red-500/20 hover:border-red-500 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-[0_2px_6px_rgba(239,68,68,0.05)]"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        Confirm Cash Sent (Set Paid)
                      </button>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ACTIVE INVESTMENTS CONTROL (SIMULATOR FORCE OPTION) */}
          <div className="glass-card rounded-2xl p-6 relative overflow-hidden space-y-4">
            <div>
              <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-400" />
                Active Multiplier Sandbox
              </h3>
              <p className="text-xs text-zinc-400">Direct visualization of live user doubling contracts. You can force-mature them instantly for rapid test evaluations.</p>
            </div>

            <div className="space-y-2.5 max-h-[250px] overflow-y-auto pr-1">
              {activeContracts.length === 0 ? (
                <div className="py-6 text-center border border-dashed border-zinc-800 rounded-xl bg-zinc-950/20">
                  <Flame className="w-6 h-6 text-zinc-700 mx-auto mb-1.5" />
                  <h4 className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">No Active Multipliers</h4>
                </div>
              ) : (
                activeContracts.map((inv) => (
                  <div key={inv.id} className="p-3 rounded-lg bg-zinc-950 border border-zinc-900/80 flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-mono text-zinc-500 font-bold">{inv.id.substring(0, 8)}</span>
                        <span className="text-[9px] font-mono text-orange-400 px-1 py-0.2 rounded bg-orange-950/30 border border-orange-500/10">Locking</span>
                      </div>
                      <p className="text-xs text-zinc-300 mt-1">
                        Amount: <strong className="text-white">{formatMoney(inv.amount)}</strong>
                      </p>
                    </div>

                    <button
                      onClick={() => onForceMatureInvestment(inv.id)}
                      className="py-1.5 px-2.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-black border border-emerald-500/20 hover:border-emerald-500 font-mono text-[10px] flex items-center gap-1 transition-all"
                      title="Force count down to hit zero instantly"
                    >
                      <Sparkles className="w-3 h-3" />
                      Mature Instantly
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
