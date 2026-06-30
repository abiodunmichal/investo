import React, { useState, useEffect } from 'react';
import { Flame, Clock, TrendingUp, AlertTriangle, Play, CheckCircle2, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Investment } from '../types';

interface InvestmentSectionProps {
  walletBalance: number;
  activeInvestments: Investment[];
  onActivateInvestment: (amount: number) => void;
  onCompleteInvestment: (id: string, doubleAmount: number) => void;
}

export default function InvestmentSection({
  walletBalance,
  activeInvestments,
  onActivateInvestment,
  onCompleteInvestment,
}: InvestmentSectionProps) {
  const [amount, setAmount] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const parsedAmount = parseFloat(amount) || 0;
  const expectedReturn = parsedAmount * 2;

  // Validation
  useEffect(() => {
    if (amount !== '') {
      if (parsedAmount <= 0) {
        setError('Amount must be greater than zero.');
      } else if (parsedAmount > walletBalance) {
        setError('Insufficient wallet balance.');
      } else {
        setError(null);
      }
    } else {
      setError(null);
    }
  }, [amount, walletBalance, parsedAmount]);

  const handleActivate = (e: React.FormEvent) => {
    e.preventDefault();
    if (parsedAmount <= 0) return;
    if (parsedAmount > walletBalance) {
      setError('Insufficient wallet balance.');
      return;
    }

    onActivateInvestment(parsedAmount);
    setAmount('');
  };

  const handlePreset = (presetVal: number) => {
    if (presetVal > walletBalance) {
      setAmount(walletBalance.toString());
    } else {
      setAmount(presetVal.toString());
    }
  };

  const formatMoney = (val: number) => {
    return '₦' + val.toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="investment-section">
      {/* INVESTMENT PORTFOLIO ACTIVATOR */}
      <div className="lg:col-span-5 glass-card rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
        <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -ml-10 -mt-10"></div>
        
        <div>
          <div className="mb-6">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-900/50 text-emerald-400 border border-emerald-500/20 text-xs font-mono">02</span>
              2-Hour Doubler
            </h2>
            <p className="text-zinc-400 text-xs mt-1">
              Multiply your funds rapidly. Any amount committed is doubled automatically in exactly 2 hours.
            </p>
          </div>

          <form onSubmit={handleActivate} className="space-y-4">
            {/* Input fields */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="invest-amount" className="block text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                  Amount to Invest
                </label>
                <span className="text-[11px] font-mono text-zinc-500">
                  Available: {formatMoney(walletBalance)}
                </span>
              </div>
              <div className="relative rounded-xl shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <span className="text-emerald-400 font-bold font-mono">₦</span>
                </div>
                <input
                  type="number"
                  name="investAmount"
                  id="invest-amount"
                  className={`block w-full rounded-xl border bg-zinc-950/70 py-3 pl-9 pr-3 text-white placeholder-zinc-500 focus:ring-1 focus:outline-none font-mono text-sm sm:text-base tracking-wide transition-colors ${
                    error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500' : 'border-zinc-800 focus:border-emerald-500 focus:ring-emerald-500'
                  }`}
                  placeholder="Minimum investment ₦100"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  min="100"
                />
              </div>
              
              {/* Error warning */}
              {error && (
                <div className="flex items-center gap-1.5 text-red-400 text-[11px] font-mono mt-1">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* Quick presets */}
            <div className="space-y-1.5">
              <span className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500">Quick Presets</span>
              <div className="grid grid-cols-4 gap-2">
                {[1000, 2500, 5000, 10000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handlePreset(preset)}
                    className="py-1.5 px-1 text-[11px] font-mono text-zinc-300 hover:text-emerald-400 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-emerald-500/30 rounded-lg transition-all"
                  >
                    +{preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Yield Calculation display */}
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/10 space-y-2 mt-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-zinc-400">Multiplier Yield</span>
                <span className="text-emerald-400 font-bold px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/20">2.0x (Double)</span>
              </div>
              <div className="flex justify-between items-end pt-1">
                <span className="text-xs text-zinc-400">Expected Return:</span>
                <span className="font-display font-extrabold text-lg sm:text-xl text-emerald-400 tracking-tight glow-text">
                  {formatMoney(expectedReturn)}
                </span>
              </div>
              <div className="text-[10px] font-mono text-zinc-500 flex items-center gap-1">
                <Clock className="w-3 h-3 text-emerald-500" />
                Maturing in 2 Hours (120 Minutes)
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={!!error || parsedAmount <= 0}
              className={`w-full py-3.5 px-4 rounded-xl font-semibold tracking-wide text-sm flex items-center justify-center gap-2 transition-all ${
                error || parsedAmount <= 0
                  ? 'bg-zinc-800 text-zinc-500 border border-zinc-800/40 cursor-not-allowed'
                  : 'bg-emerald-400 text-black shadow-[0_4px_20px_rgba(34,197,94,0.15)] hover:bg-emerald-300 hover:shadow-[0_4px_25px_rgba(34,197,94,0.3)] active:scale-[0.99]'
              }`}
            >
              <Zap className="w-4 h-4 text-current fill-current shrink-0" />
              Activate 2-Hour Multiplier
            </button>
          </form>
        </div>
      </div>

      {/* ACTIVE MULTIPLIERS LIST & MONITOR */}
      <div className="lg:col-span-7 glass-card rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
        
        <div>
          <div className="mb-4">
            <h3 className="font-display font-bold text-lg text-white">Active Contracts</h3>
            <p className="text-zinc-400 text-xs mt-0.5">Live monitoring of your active multipliers, including countdown calculations.</p>
          </div>

          <div className="space-y-4 max-h-[340px] overflow-y-auto pr-1">
            <AnimatePresence mode="popLayout">
              {activeInvestments.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-12 flex flex-col items-center justify-center text-center border border-dashed border-zinc-800 rounded-xl bg-zinc-950/20"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-950/30 border border-emerald-500/10 flex items-center justify-center text-emerald-400/80 mb-3 animate-pulse">
                    <Clock className="w-6 h-6" />
                  </div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-300 font-bold">No Active Multipliers</h4>
                  <p className="text-[11px] text-zinc-500 max-w-xs mt-1">
                    Your active investments will appear here. Enter an amount on the left to activate your 2-hour multiplier.
                  </p>
                </motion.div>
              ) : (
                activeInvestments.map((inv) => (
                  <InvestmentCard
                    key={inv.id}
                    investment={inv}
                    onComplete={onCompleteInvestment}
                    formatMoney={formatMoney}
                  />
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

/* INDIVIDUAL LIVE COUNTDOWN INVESTMENT CARD */
interface InvestmentCardProps {
  key?: string;
  investment: Investment;
  onComplete: (id: string, doubleAmount: number) => void;
  formatMoney: (val: number) => string;
}

function InvestmentCard({ investment, onComplete, formatMoney }: InvestmentCardProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [progress, setProgress] = useState<number>(100);

  useEffect(() => {
    const calculateTime = () => {
      const now = Date.now();
      const remainingMs = investment.endsAt - now;
      const remainingSec = Math.max(0, Math.floor(remainingMs / 1000));
      setTimeLeft(remainingSec);

      // Progress Calculation (0 to 100)
      const totalDuration = (investment.endsAt - investment.startedAt) / 1000;
      const progressPercent = totalDuration > 0 
        ? Math.max(0, Math.min(100, (remainingSec / totalDuration) * 100))
        : 0;
      setProgress(progressPercent);

      // Auto-trigger payout when complete and not completed in record
      if (remainingSec <= 0 && !investment.completed) {
        onComplete(investment.id, investment.expectedReturn);
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [investment, onComplete]);

  // Format time (02:00:00 style)
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return [
      hrs.toString().padStart(2, '0'),
      mins.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0'),
    ].join(':');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className={`p-4 rounded-xl border backdrop-blur-sm relative overflow-hidden transition-all ${
        timeLeft <= 0 
          ? 'bg-emerald-950/20 border-emerald-500/40 glow-green' 
          : 'bg-zinc-950/60 border-zinc-800 hover:border-emerald-500/20'
      }`}
    >
      {/* Background glowing indicator */}
      {timeLeft <= 0 && (
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl -mr-6 -mt-6"></div>
      )}

      <div className="flex justify-between items-start gap-4">
        {/* Core numbers */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">ACTIVE CONTRACT</span>
            <span className="text-[9px] font-mono text-zinc-500">ID: {investment.id.substring(0, 8)}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-bold text-lg text-white">
              {formatMoney(investment.amount)}
            </span>
            <span className="text-zinc-500 font-mono text-xs">→</span>
            <span className="font-display font-bold text-lg text-emerald-400 glow-text">
              {formatMoney(investment.expectedReturn)}
            </span>
          </div>
        </div>

        {/* Counter indicator */}
        <div className="text-right">
          {timeLeft <= 0 ? (
            <div className="flex items-center gap-1 text-emerald-400 text-xs font-mono font-bold bg-emerald-950/60 px-2 py-1 rounded-lg border border-emerald-500/30 glow-text animate-pulse">
              <CheckCircle2 className="w-3.5 h-3.5" />
              DOUBLED & CREDITED
            </div>
          ) : (
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1 text-orange-400 font-mono font-bold text-sm bg-orange-950/30 px-2 py-0.5 rounded-lg border border-orange-500/20">
                <Clock className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
                {formatTime(timeLeft)}
              </div>
              <span className="text-[9px] font-mono text-zinc-500 mt-1 uppercase">2x Multiplying</span>
            </div>
          )}
        </div>
      </div>

      {/* Countdown Progress Slider Bar */}
      {timeLeft > 0 && (
        <div className="mt-3.5">
          <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden border border-zinc-800/40">
            <div
              className="bg-gradient-to-r from-emerald-500 to-green-400 h-full rounded-full transition-all duration-1000 ease-linear shadow-[0_0_8px_rgba(34,197,94,0.5)]"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center mt-1.5 text-[9px] font-mono text-zinc-500">
            <span>Started: {new Date(investment.startedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
            <span>Target: {new Date(investment.endsAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
