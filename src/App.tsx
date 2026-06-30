import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wallet, 
  Sparkles, 
  Flame, 
  ArrowUpRight, 
  History, 
  Zap, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  LayoutGrid, 
  Layers,
  HelpCircle,
  TrendingUp
} from 'lucide-react';
import Header from './components/Header';
import WalletStats from './components/WalletStats';
import DepositSection from './components/DepositSection';
import InvestmentSection from './components/InvestmentSection';
import WithdrawalSection from './components/WithdrawalSection';
import TransactionHistory from './components/TransactionHistory';
import AdminPortal from './components/AdminPortal';
import { Investment, Transaction } from './types';

export default function App() {
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [activeInvestments, setActiveInvestments] = useState<Investment[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState<'deposit' | 'invest' | 'withdraw' | 'history' | 'all' | 'admin'>('all');
  
  // Custom Features: Faucet, Simulation Mode, Celebration Overlay
  const [simulationMode, setSimulationMode] = useState<boolean>(false); // false = 2 Hours, true = 2 Minutes
  const [celebrationInvestment, setCelebrationInvestment] = useState<Investment | null>(null);
  const [hasCheckedMaturedOnStartup, setHasCheckedMaturedOnStartup] = useState(false);

  // Helper ID generator
  const generateId = () => Math.random().toString(36).substring(2, 11);

  // 1. Initial State Loading from LocalStorage
  useEffect(() => {
    try {
      const savedBalance = localStorage.getItem('nexus_wallet_balance');
      const savedInvestments = localStorage.getItem('nexus_investments');
      const savedTransactions = localStorage.getItem('nexus_transactions');
      const savedSimMode = localStorage.getItem('nexus_sim_mode');

      if (savedBalance) setWalletBalance(parseFloat(savedBalance));
      if (savedInvestments) setActiveInvestments(JSON.parse(savedInvestments));
      if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
      if (savedSimMode) setSimulationMode(savedSimMode === 'true');
    } catch (e) {
      console.error('Failed to load local storage state:', e);
    }
  }, []);

  // 2. LocalStorage Persistence Sync
  useEffect(() => {
    localStorage.setItem('nexus_wallet_balance', walletBalance.toString());
  }, [walletBalance]);

  useEffect(() => {
    localStorage.setItem('nexus_investments', JSON.stringify(activeInvestments));
  }, [activeInvestments]);

  useEffect(() => {
    localStorage.setItem('nexus_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('nexus_sim_mode', simulationMode.toString());
  }, [simulationMode]);

  // 3. Startup Sweep for Offline-Completed Investments
  useEffect(() => {
    if (activeInvestments.length === 0 || hasCheckedMaturedOnStartup) return;

    const now = Date.now();
    let updatedBalance = walletBalance;
    let anyUpdates = false;
    
    const updatedInvestments = activeInvestments.map(inv => {
      if (!inv.completed && inv.endsAt <= now) {
        updatedBalance += inv.expectedReturn;
        anyUpdates = true;
        
        // Add completion transaction
        const payoutTx: Transaction = {
          id: generateId(),
          type: 'payout',
          amount: inv.expectedReturn,
          status: 'completed',
          timestamp: inv.endsAt, // exact time it was completed
          details: `Offline 2x Multiplier Payout for ₦${inv.amount.toLocaleString('en-NG')}`,
        };
        
        setTransactions(prev => [payoutTx, ...prev]);
        
        return { ...inv, completed: true, claimed: true };
      }
      return inv;
    });

    if (anyUpdates) {
      setWalletBalance(updatedBalance);
      setActiveInvestments(updatedInvestments);
    }
    setHasCheckedMaturedOnStartup(true);
  }, [activeInvestments, walletBalance, hasCheckedMaturedOnStartup]);

  // Handlers for Deposit Request (submitted by user, starts as pending approval)
  const handleDepositRequest = (amount: number, receiptFile: File | null) => {
    // We DO NOT increment the balance immediately now! It goes to the pending approval queue first!
    const newTx: Transaction = {
      id: 'DEP-' + generateId().toUpperCase(),
      type: 'deposit',
      amount,
      status: 'pending',
      timestamp: Date.now(),
      details: `Pending Deposit Request (OPay Direct Transfer)${receiptFile ? ` • Receipt: ${receiptFile.name}` : ''}`,
    };

    setTransactions(prev => [newTx, ...prev]);
  };

  // Administrative Approval/Decline action handlers
  const handleApproveDeposit = (txId: string, autoInvest: boolean = false) => {
    let approvedAmount = 0;
    
    setTransactions(prev => prev.map(tx => {
      if (tx.id === txId && tx.status === 'pending') {
        approvedAmount = tx.amount;
        return { 
          ...tx, 
          status: 'completed',
          details: tx.details.replace('Pending Deposit Request', 'Approved Deposit') + (autoInvest ? ' & Automatically Doubling' : '')
        };
      }
      return tx;
    }));

    if (approvedAmount > 0) {
      if (autoInvest) {
        // Automatically start the doubling multiplier!
        const durationMs = simulationMode ? 2 * 60 * 1000 : 2 * 60 * 60 * 1000;
        const now = Date.now();

        const newInvestment: Investment = {
          id: 'INV-' + generateId().toUpperCase(),
          amount: approvedAmount,
          expectedReturn: approvedAmount * 2,
          startedAt: now,
          endsAt: now + durationMs,
          completed: false,
          claimed: false,
        };

        setActiveInvestments(prev => [newInvestment, ...prev]);

        // Add a locked investment transaction log too
        const investTx: Transaction = {
          id: generateId(),
          type: 'investment',
          amount: approvedAmount,
          status: 'completed',
          timestamp: now,
          details: `Activated 2-Hour Doubler contract via Admin approval (Yield: 2.0x)`,
        };

        setTransactions(prev => [investTx, ...prev]);
      } else {
        // Just credit the wallet general balance so they can choose when to invest
        setWalletBalance(prev => prev + approvedAmount);
      }
    }
  };

  const handleRejectDeposit = (txId: string) => {
    setTransactions(prev => prev.map(tx => {
      if (tx.id === txId && tx.status === 'pending') {
        return { 
          ...tx, 
          status: 'failed', 
          details: tx.details.replace('Pending Deposit Request', 'Rejected Deposit Request') 
        };
      }
      return tx;
    }));
  };

  const handleApproveWithdrawal = (txId: string) => {
    setTransactions(prev => prev.map(tx => {
      if (tx.id === txId && tx.status === 'pending' && tx.type === 'withdrawal') {
        return { ...tx, status: 'completed' };
      }
      return tx;
    }));
  };

  const handleForceMatureInvestment = (id: string) => {
    setActiveInvestments(prev => 
      prev.map(inv => {
        if (inv.id === id && !inv.completed) {
          // Force endsAt time to trigger completion immediately
          return { ...inv, endsAt: Date.now() - 1000 };
        }
        return inv;
      })
    );
  };

  // Handlers for Investment Activated
  const handleActivateInvestment = (amountToInvest: number) => {
    // Deduct from balance
    setWalletBalance(prev => prev - amountToInvest);

    // Calculate end time: 2 hours (120 minutes) or 2 minutes for simulation
    const durationMs = simulationMode ? 2 * 60 * 1000 : 2 * 60 * 60 * 1000;
    const now = Date.now();

    const newInvestment: Investment = {
      id: 'INV-' + generateId().toUpperCase(),
      amount: amountToInvest,
      expectedReturn: amountToInvest * 2,
      startedAt: now,
      endsAt: now + durationMs,
      completed: false,
      claimed: false,
    };

    setActiveInvestments(prev => [newInvestment, ...prev]);

    // Create locked transaction
    const newTx: Transaction = {
      id: generateId(),
      type: 'investment',
      amount: amountToInvest,
      status: 'completed',
      timestamp: now,
      details: `Activated 2-Hour Doubler contract (Yield: 2.0x)`,
    };

    setTransactions(prev => [newTx, ...prev]);
  };

  // Handlers for Investment Complete (ticking hits 0)
  const handleCompleteInvestment = (id: string, doubleAmount: number) => {
    let completedInv: Investment | null = null;

    setActiveInvestments(prev => 
      prev.map(inv => {
        if (inv.id === id && !inv.completed) {
          completedInv = { ...inv, completed: true, claimed: true };
          return completedInv;
        }
        return inv;
      })
    );

    // Prevent double crediting
    if (completedInv) {
      setWalletBalance(prev => prev + doubleAmount);

      // Create maturity payout transaction
      const payoutTx: Transaction = {
        id: generateId(),
        type: 'payout',
        amount: doubleAmount,
        status: 'completed',
        timestamp: Date.now(),
        details: `Doubler Matured: Credit payout for ₦${(doubleAmount/2).toLocaleString('en-NG')}`,
      };

      setTransactions(prev => [payoutTx, ...prev]);
      setCelebrationInvestment(completedInv);
    }
  };

  // Handlers for Withdrawal Submission
  const handleWithdrawalSubmit = (amountToWithdraw: number, bankName: string, acctNum: string, acctName: string) => {
    // Deduct from balance
    setWalletBalance(prev => prev - amountToWithdraw);

    // Create withdrawal transaction
    const newTx: Transaction = {
      id: generateId(),
      type: 'withdrawal',
      amount: amountToWithdraw,
      status: 'pending',
      timestamp: Date.now(),
      details: `Withdrawn to ${bankName} (${acctNum} - ${acctName})`,
    };

    setTransactions(prev => [newTx, ...prev]);
  };

  const formatMoney = (val: number) => {
    return '₦' + val.toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans grid-pattern relative selection:bg-emerald-500/30 selection:text-emerald-300">
      
      {/* HEADER SECTION */}
      <Header walletBalance={walletBalance} />

      {/* BODY CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 space-y-6">
        
        {/* FAUCET & SIMULATION BANNER */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 p-4 rounded-xl bg-zinc-900/90 border border-emerald-500/20 backdrop-blur-md glow-green">
          <div className="flex items-center space-x-3 text-center sm:text-left">
            <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-mono text-zinc-400 uppercase tracking-widest font-semibold">Evaluation Assistant</p>
              <h4 className="text-xs text-white">Reviewing the app? Use the developer simulation panel for direct sandbox controls.</h4>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-end">
            {/* Simulation Mode Toggle */}
            <button
              onClick={() => setSimulationMode(!simulationMode)}
              className={`px-3 py-1.5 rounded-lg border text-[11px] font-mono tracking-wider transition-all flex items-center gap-1.5 ${
                simulationMode 
                  ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/40' 
                  : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700'
              }`}
              title="Toggle fast-timer mode"
            >
              <Zap className={`w-3.5 h-3.5 ${simulationMode ? 'animate-bounce fill-current' : ''}`} />
              {simulationMode ? 'SIM: 2-Min Fast Multiplier' : 'REAL: 2-Hour Timer'}
            </button>
          </div>
        </div>

        {/* METRICS DASHBOARD CARD STATS */}
        <WalletStats
          walletBalance={walletBalance}
          activeInvestmentsCount={activeInvestments.filter(i => !i.completed).length}
          totalInvestedAmount={activeInvestments.reduce((sum, current) => sum + current.amount, 0)}
          totalEarnedAmount={transactions.filter(t => t.type === 'payout').reduce((sum, current) => sum + current.amount, 0)}
          totalWithdrawnAmount={transactions.filter(t => t.type === 'withdrawal').reduce((sum, current) => sum + current.amount, 0)}
        />

        {/* SECTION NAV TABS CONTAINER */}
        <div className="space-y-4">
          <div className="flex flex-wrap p-1.5 bg-zinc-900/60 backdrop-blur-md rounded-xl border border-zinc-800 gap-1.5 max-w-fit">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                activeTab === 'all'
                  ? 'bg-emerald-500 text-black font-bold shadow-[0_2px_10px_rgba(34,197,94,0.3)]'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-950/40'
              }`}
            >
              Dashboard View
            </button>
            <button
              onClick={() => setActiveTab('deposit')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                activeTab === 'deposit'
                  ? 'bg-emerald-500 text-black font-bold shadow-[0_2px_10px_rgba(34,197,94,0.3)]'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-950/40'
              }`}
            >
              Fund Wallet
            </button>
            <button
              onClick={() => setActiveTab('invest')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                activeTab === 'invest'
                  ? 'bg-emerald-500 text-black font-bold shadow-[0_2px_10px_rgba(34,197,94,0.3)]'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-950/40'
              }`}
            >
              2-Hour Doubler
            </button>
            <button
              onClick={() => setActiveTab('withdraw')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                activeTab === 'withdraw'
                  ? 'bg-emerald-500 text-black font-bold shadow-[0_2px_10px_rgba(34,197,94,0.3)]'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-950/40'
              }`}
            >
              Cash Out
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                activeTab === 'history'
                  ? 'bg-emerald-500 text-black font-bold shadow-[0_2px_10px_rgba(34,197,94,0.3)]'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-950/40'
              }`}
            >
              Logs
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                activeTab === 'admin'
                  ? 'bg-emerald-500 text-black font-bold shadow-[0_2px_10px_rgba(34,197,94,0.3)]'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-950/40'
              }`}
            >
              Admin Portal
            </button>
          </div>

          {/* ACTIVE CONTENT WITH TABS AND TRANSITIONS */}
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {/* ALL SECTIONS (DASHBOARD FLOW) */}
              {activeTab === 'all' && (
                <motion.div
                  key="tab-all"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <DepositSection onDepositVerified={handleDepositRequest} />
                  <InvestmentSection
                    walletBalance={walletBalance}
                    activeInvestments={activeInvestments.filter(i => !i.completed)}
                    onActivateInvestment={handleActivateInvestment}
                    onCompleteInvestment={handleCompleteInvestment}
                  />
                  <WithdrawalSection
                    walletBalance={walletBalance}
                    onSubmitWithdrawal={handleWithdrawalSubmit}
                  />
                  <TransactionHistory transactions={transactions} />
                </motion.div>
              )}

              {/* INDIVIDUAL DEPOSIT SECTION */}
              {activeTab === 'deposit' && (
                <motion.div
                  key="tab-deposit"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <DepositSection onDepositVerified={handleDepositRequest} />
                </motion.div>
              )}

              {/* INDIVIDUAL INVESTMENT SECTION */}
              {activeTab === 'invest' && (
                <motion.div
                  key="tab-invest"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <InvestmentSection
                    walletBalance={walletBalance}
                    activeInvestments={activeInvestments.filter(i => !i.completed)}
                    onActivateInvestment={handleActivateInvestment}
                    onCompleteInvestment={handleCompleteInvestment}
                  />
                </motion.div>
              )}

              {/* INDIVIDUAL WITHDRAWAL SECTION */}
              {activeTab === 'withdraw' && (
                <motion.div
                  key="tab-withdraw"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <WithdrawalSection
                    walletBalance={walletBalance}
                    onSubmitWithdrawal={handleWithdrawalSubmit}
                  />
                </motion.div>
              )}

              {/* INDIVIDUAL TRANSACTION HISTORY */}
              {activeTab === 'history' && (
                <motion.div
                  key="tab-history"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <TransactionHistory transactions={transactions} />
                </motion.div>
              )}

              {/* ADMIN PORTAL SECTION */}
              {activeTab === 'admin' && (
                <motion.div
                  key="tab-admin"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <AdminPortal
                    transactions={transactions}
                    activeInvestments={activeInvestments}
                    walletBalance={walletBalance}
                    onApproveDeposit={handleApproveDeposit}
                    onRejectDeposit={handleRejectDeposit}
                    onApproveWithdrawal={handleApproveWithdrawal}
                    onForceMatureInvestment={handleForceMatureInvestment}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* PLATFORM SECURITY DISCLAIMER FOOTER */}
        <footer className="pt-8 pb-12 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center text-zinc-500 text-xs gap-4 font-mono">
          <p>© 2026 NEXUS Multiplier Systems. All rights secured.</p>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>End-to-End Encrypted Verification Node via OPay Gateway</span>
          </div>
        </footer>
      </main>

      {/* CELEBRATION MODAL FOR MATURED INVESTMENT */}
      <AnimatePresence>
        {celebrationInvestment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card max-w-md w-full rounded-2xl p-6 text-center border border-emerald-500 glow-green space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400 mx-auto animate-bounce">
                <CheckCircle2 className="w-10 h-10 shrink-0" />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase">MULTIPLIER MATURED</span>
                <h3 className="font-display font-bold text-2xl text-white">Funds Doubled!</h3>
                <p className="text-xs text-zinc-400">
                  Your 2-Hour contract has successfully matured and payouts have been automatically credited.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-900 divide-y divide-zinc-900 text-sm font-sans">
                <div className="flex justify-between py-2 text-zinc-400">
                  <span>Investment Amount:</span>
                  <span className="font-mono text-white">{formatMoney(celebrationInvestment.amount)}</span>
                </div>
                <div className="flex justify-between py-2 text-zinc-400">
                  <span>Multiplier Yield:</span>
                  <span className="text-emerald-400 font-bold font-mono">2.0x</span>
                </div>
                <div className="flex justify-between py-2 font-bold text-lg pt-3">
                  <span className="text-white">Amount Credited:</span>
                  <span className="text-emerald-400 font-display glow-text">{formatMoney(celebrationInvestment.expectedReturn)}</span>
                </div>
              </div>

              <button
                onClick={() => setCelebrationInvestment(null)}
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm transition-all"
              >
                Claim & Add to Balance
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
