import React, { useState, useEffect } from 'react';
import { Shield, Clock, TrendingUp, Cpu } from 'lucide-react';

interface HeaderProps {
  walletBalance: number;
}

export default function Header({ walletBalance }: HeaderProps) {
  const [timeString, setTimeString] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(now.toLocaleTimeString('en-US', { hour12: false }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="border-b border-emerald-950/40 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Brand */}
          <div className="flex items-center space-x-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-[0_0_15px_rgba(16,185,129,0.3)] animate-pulse">
              <TrendingUp className="w-5 h-5 text-black stroke-[2.5]" />
              <div className="absolute -inset-0.5 rounded-xl bg-emerald-500/20 blur opacity-70 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            </div>
            <div>
              <h1 className="font-display font-bold text-lg sm:text-xl text-white tracking-tight flex items-center gap-1.5">
                NEXUS <span className="text-emerald-400 font-extrabold text-sm sm:text-base px-2 py-0.5 rounded-lg bg-emerald-950/60 border border-emerald-500/20 glow-text">2-HOUR</span>
              </h1>
              <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Investment Platform</p>
            </div>
          </div>

          {/* Quick Metrics & Time */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            {/* Live Clock */}
            <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-zinc-900/80 border border-zinc-800">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span className="font-mono text-xs text-zinc-300 font-medium tracking-wider">{timeString}</span>
            </div>

            {/* Platform Status */}
            <div className="flex items-center space-x-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-mono text-emerald-400 tracking-wider uppercase font-semibold">Active Node</span>
            </div>

            {/* SSL SECURE */}
            <div className="hidden sm:flex items-center space-x-1 text-zinc-400 hover:text-emerald-400 transition-colors cursor-help">
              <Shield className="w-3.5 h-3.5" />
              <span className="text-[10px] font-mono tracking-wider uppercase">SSL Secure</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
