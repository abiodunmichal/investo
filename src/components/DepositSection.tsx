import React, { useState, useRef } from 'react';
import { Copy, Check, ExternalLink, UploadCloud, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface DepositSectionProps {
  onDepositVerified: (amount: number, receiptFile: File | null) => void;
}

export default function DepositSection({ onDepositVerified }: DepositSectionProps) {
  const PRESET_AMOUNTS = [1000, 2000, 3000, 5000, 10000];
  const [selectedAmount, setSelectedAmount] = useState<number>(3000); // default selection
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [isDragActive, setIsDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const bankDetails = {
    bankName: 'OPay',
    accountNumber: '9014761610',
    accountName: 'Abiodun Rapheal Oluwatimilehin',
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Drag and Drop Handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setReceiptFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReceiptFile(e.target.files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!PRESET_AMOUNTS.includes(selectedAmount)) {
      alert('Please select a valid deposit amount from the listed options.');
      return;
    }

    // Call the parent state updater to add a pending deposit transaction
    onDepositVerified(selectedAmount, receiptFile);

    // Build pre-filled WhatsApp message
    const formattedAmount = selectedAmount.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' });
    const message = `Hello Admin, I have just initiated a deposit of ${formattedAmount} to your OPay account.\n\n*Deposit Details*:\n- Bank Name: ${bankDetails.bankName}\n- Account Name: ${bankDetails.accountName}\n- Account Number: ${bankDetails.accountNumber}\n- Amount Sent: ${formattedAmount}${receiptFile ? `\n- Receipt Attached: ${receiptFile.name}` : ''}\n\nPlease approve this deposit request on your admin site so my multiplier contract can begin to double immediately. Thank you!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/2349067439151?text=${encodedMessage}`;

    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');

    // Reset inputs
    setReceiptFile(null);
  };

  return (
    <div className="glass-card rounded-2xl p-6 relative overflow-hidden" id="deposit-section">
      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl -mr-6 -mt-6"></div>

      <div className="mb-6">
        <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
          <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-900/50 text-emerald-400 border border-emerald-500/20 text-xs font-mono">01</span>
          Fund Your Wallet
        </h2>
        <p className="text-zinc-400 text-xs mt-1">Make a transfer of your chosen amount to the official bank details below to initiate your multiplier request.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Step 1 & Bank Details Display */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-3.5 relative">
            <div className="flex items-center gap-2 pb-2.5 border-b border-zinc-800/60">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-300 font-semibold">Official Payment Details</span>
            </div>

            {/* Bank Name Field */}
            <div className="flex justify-between items-center group/item">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Bank Name</p>
                <p className="text-sm font-sans font-semibold text-white">{bankDetails.bankName}</p>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(bankDetails.bankName, 'bank')}
                className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-emerald-500/30 text-zinc-400 hover:text-emerald-400 transition-all"
                title="Copy Bank Name"
              >
                {copiedField === 'bank' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Account Number Field */}
            <div className="flex justify-between items-center group/item">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Account Number</p>
                <p className="text-lg font-mono font-bold text-emerald-400 tracking-wider glow-text">{bankDetails.accountNumber}</p>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(bankDetails.accountNumber, 'accountNumber')}
                className="p-1.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-900 border border-emerald-500/20 hover:border-emerald-500/50 text-emerald-400 transition-all"
                title="Copy Account Number"
              >
                {copiedField === 'accountNumber' ? (
                  <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Copied
                  </span>
                ) : (
                  <span className="text-xs font-mono flex items-center gap-1">
                    <Copy className="w-3.5 h-3.5" /> Copy
                  </span>
                )}
              </button>
            </div>

            {/* Account Name Field */}
            <div className="flex justify-between items-center group/item">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Account Name</p>
                <p className="text-xs sm:text-sm font-sans font-medium text-white line-clamp-1">{bankDetails.accountName}</p>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(bankDetails.accountName, 'accountName')}
                className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-emerald-500/30 text-zinc-400 hover:text-emerald-400 transition-all"
                title="Copy Account Name"
              >
                {copiedField === 'accountName' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="text-[11px] font-mono text-zinc-400 flex items-start gap-2 bg-emerald-950/10 border border-emerald-950/40 rounded-xl p-3.5">
            <span className="text-emerald-400 font-bold mt-0.5">•</span>
            <span>
              Choose an amount (₦1,000 - ₦10,000) below, transfer it to the OPay account, and submit. The administrator will approve your deposit in the admin site to trigger your doubling contract.
            </span>
          </div>
        </div>

        {/* Deposit Verification Form */}
        <form onSubmit={handleVerify} className="lg:col-span-7 space-y-5">
          {/* Preset Amount Grid */}
          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
              Select Deposit Amount (₦)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {PRESET_AMOUNTS.map((amt) => {
                const isSelected = selectedAmount === amt;
                return (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setSelectedAmount(amt)}
                    className={`py-3 px-1.5 rounded-xl border font-mono text-xs sm:text-sm font-bold tracking-wide transition-all duration-200 flex flex-col items-center justify-center gap-1.5 relative overflow-hidden ${
                      isSelected
                        ? 'bg-emerald-950/40 border-emerald-400 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.15)] glow-green'
                        : 'bg-zinc-950/60 border-zinc-800/80 text-zinc-400 hover:text-white hover:border-zinc-700'
                    }`}
                  >
                    <span className="text-[10px] font-mono text-zinc-500 block uppercase font-medium">Value</span>
                    <span>₦{amt.toLocaleString('en-NG')}</span>
                    {isSelected && (
                      <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Receipt upload (Drag and Drop / Click selector) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
              Payment Receipt / Screenshot (Optional)
            </label>
            
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={triggerFileSelect}
              className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all ${
                isDragActive
                  ? 'border-emerald-500 bg-emerald-950/10'
                  : receiptFile
                  ? 'border-emerald-500/50 bg-zinc-950/40'
                  : 'border-zinc-800 hover:border-zinc-700 bg-zinc-950/30 hover:bg-zinc-950/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*,application/pdf"
                onChange={handleFileChange}
              />
              
              {receiptFile ? (
                <div className="flex items-center space-x-2 text-center">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                  <div className="text-left">
                    <p className="text-xs font-semibold text-white line-clamp-1">{receiptFile.name}</p>
                    <p className="text-[10px] font-mono text-zinc-500">{(receiptFile.size / 1024).toFixed(1)} KB • Click to replace</p>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-1">
                  <UploadCloud className="w-6 h-6 text-zinc-400 mx-auto" />
                  <p className="text-xs text-zinc-300 font-medium">
                    <span className="text-emerald-400">Click to upload</span> or drag and drop receipt
                  </p>
                  <p className="text-[10px] font-mono text-zinc-500">PNG, JPG, or PDF</p>
                </div>
              )}
            </div>
          </div>

          {/* Submit/Verify button */}
          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-black font-semibold tracking-wide text-sm flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(34,197,94,0.2)] hover:shadow-[0_4px_25px_rgba(34,197,94,0.35)] transition-all active:scale-[0.99]"
          >
            Submit for Admin Approval & Notify WhatsApp
            <ExternalLink className="w-4 h-4 text-black stroke-[2.5]" />
          </button>
          
          <p className="text-[10px] font-mono text-center text-zinc-500">
            Secure request queuing. Status turns to active immediately upon Admin validation.
          </p>
        </form>
      </div>
    </div>
  );
}
