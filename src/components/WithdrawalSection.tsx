import React, { useState, useEffect } from 'react';
import { ExternalLink, CreditCard, ShieldAlert, CheckCircle2, UserCircle, Smartphone, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface WithdrawalSectionProps {
  walletBalance: number;
  onSubmitWithdrawal: (amount: number, bankName: string, acctNumber: string, acctName: string) => void;
}

export default function WithdrawalSection({ walletBalance, onSubmitWithdrawal }: WithdrawalSectionProps) {
  const [amount, setAmount] = useState<string>('');
  const [bankName, setBankName] = useState<string>('');
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [accountName, setAccountName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const parsedAmount = parseFloat(amount) || 0;

  // Real-time balance validation
  useEffect(() => {
    if (amount !== '') {
      if (parsedAmount <= 0) {
        setError('Amount must be greater than zero.');
      } else if (parsedAmount > walletBalance) {
        setError('Insufficient balance in your wallet.');
      } else {
        setError(null);
      }
    } else {
      setError(null);
    }
  }, [amount, walletBalance, parsedAmount]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parsedAmount <= 0) return;
    if (parsedAmount > walletBalance) {
      setError('Insufficient balance in your wallet.');
      return;
    }

    if (!bankName || !accountNumber || !accountName) {
      alert('Please fill in all bank details.');
      return;
    }

    // Call state update in parent (deduct funds and log transaction)
    onSubmitWithdrawal(parsedAmount, bankName, accountNumber, accountName);

    // Build WhatsApp Message Link
    const formattedAmount = parsedAmount.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' });
    const message = `Hello Admin, I would like to request a withdrawal of ${formattedAmount} from my 2-Hour Investment wallet.\n\n*My Bank Payout Details*:\n- Bank Name: ${bankName}\n- Account Name: ${accountName}\n- Account Number: ${accountNumber}\n- Amount Requested: ${formattedAmount}\n\nPlease process this transaction. Thank you!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/2347067439151?text=${encodedMessage}`;

    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');

    // Clear form
    setAmount('');
    setBankName('');
    setAccountNumber('');
    setAccountName('');
  };

  const formatMoney = (val: number) => {
    return '₦' + val.toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  };

  return (
    <div className="glass-card rounded-2xl p-6 relative overflow-hidden" id="withdrawal-section">
      <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-2xl -mr-6 -mt-6"></div>

      <div className="mb-6">
        <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
          <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-900/50 text-emerald-400 border border-emerald-500/20 text-xs font-mono">03</span>
          Cash Out
        </h2>
        <p className="text-zinc-400 text-xs mt-1">
          Withdraw your matured doubler earnings instantly to any preferred local bank. No hidden fees.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Amount to Withdraw */}
            <div className="space-y-1.5 md:col-span-2">
              <div className="flex justify-between items-center">
                <label htmlFor="withdraw-amount" className="block text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                  Amount to Withdraw
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
                  name="withdrawAmount"
                  id="withdraw-amount"
                  className={`block w-full rounded-xl border bg-zinc-950/70 py-3 pl-9 pr-3 text-white placeholder-zinc-500 focus:ring-1 focus:outline-none font-mono text-sm sm:text-base tracking-wide transition-colors ${
                    error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500' : 'border-zinc-800 focus:border-emerald-500 focus:ring-emerald-500'
                  }`}
                  placeholder="Enter withdrawal amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  min="100"
                />
              </div>

              {error && (
                <div className="flex items-center gap-1.5 text-red-400 text-[11px] font-mono mt-1">
                  <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* Bank Name */}
            <div className="space-y-1.5">
              <label htmlFor="bank-name" className="block text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                Destination Bank Name
              </label>
              <div className="relative rounded-xl">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <CreditCard className="w-4 h-4 text-zinc-500" />
                </div>
                <input
                  type="text"
                  name="bankName"
                  id="bank-name"
                  className="block w-full rounded-xl border border-zinc-800 bg-zinc-950/70 py-2.5 pl-9 pr-3 text-white placeholder-zinc-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none text-xs sm:text-sm font-sans"
                  placeholder="e.g. OPay, GTBank, Kuda"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Account Number */}
            <div className="space-y-1.5">
              <label htmlFor="account-num" className="block text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                Account Number (10 Digits)
              </label>
              <div className="relative rounded-xl">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Smartphone className="w-4 h-4 text-zinc-500" />
                </div>
                <input
                  type="text"
                  name="accountNum"
                  id="account-num"
                  pattern="[0-9]{10}"
                  maxLength={10}
                  className="block w-full rounded-xl border border-zinc-800 bg-zinc-950/70 py-2.5 pl-9 pr-3 text-white placeholder-zinc-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none font-mono text-xs sm:text-sm"
                  placeholder="e.g. 9014761610"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                  required
                />
              </div>
            </div>

            {/* Account Name */}
            <div className="space-y-1.5 md:col-span-2">
              <label htmlFor="account-name" className="block text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                Recipient Account Name
              </label>
              <div className="relative rounded-xl">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <UserCircle className="w-4 h-4 text-zinc-500" />
                </div>
                <input
                  type="text"
                  name="accountName"
                  id="account-name"
                  className="block w-full rounded-xl border border-zinc-800 bg-zinc-950/70 py-2.5 pl-9 pr-3 text-white placeholder-zinc-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none text-xs sm:text-sm font-sans"
                  placeholder="e.g. Abiodun Michael"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={!!error || parsedAmount <= 0 || !bankName || accountNumber.length !== 10 || !accountName}
            className={`w-full py-3.5 px-4 rounded-xl font-semibold tracking-wide text-sm flex items-center justify-center gap-2 transition-all ${
              error || parsedAmount <= 0 || !bankName || accountNumber.length !== 10 || !accountName
                ? 'bg-zinc-800 text-zinc-500 border border-zinc-800/40 cursor-not-allowed'
                : 'bg-emerald-400 text-black shadow-[0_4px_20px_rgba(34,197,94,0.15)] hover:bg-emerald-300 hover:shadow-[0_4px_25px_rgba(34,197,94,0.3)] active:scale-[0.99]'
            }`}
          >
            Submit Withdrawal via WhatsApp
            <ExternalLink className="w-4 h-4 text-black stroke-[2.5]" />
          </button>
        </form>

        {/* Informative Side Panel */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80 space-y-3.5">
            <div className="flex items-center gap-2 pb-2.5 border-b border-zinc-800/60 text-zinc-400">
              <HelpCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-300 font-semibold">How Payouts Work</span>
            </div>

            <ul className="space-y-3 text-[11px] font-sans text-zinc-400 leading-relaxed list-none">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>
                  <strong>Deduction:</strong> The selected withdrawal amount is immediately deducted from your local wallet balance.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>
                  <strong>Routing:</strong> Your secure bank credentials are sent directly to the administrator on WhatsApp.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>
                  <strong>Manual Payout:</strong> Admin will verify your investment logs and transfer the money directly from their OPay app to your specified destination bank account.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
