'use client';

import { useCurrency } from './CurrencyProvider';
import { Coins } from 'lucide-react';

export default function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="relative group flex items-center gap-1 bg-[#1a2333] hover:bg-[#202b3d] border border-gray-700 hover:border-brand-cyan/50 px-3 py-1.5 rounded-full transition-colors cursor-pointer text-sm">
      <Coins className="w-4 h-4 text-brand-cyan" />
      <select 
        value={currency} 
        onChange={(e) => setCurrency(e.target.value as any)}
        className="appearance-none bg-transparent outline-none text-gray-300 font-bold cursor-pointer focus:text-white ltr:pr-4 rtl:pl-4 transition-colors"
      >
        <option value="EGP" className="bg-[#1a2333] text-white">EGP</option>
        <option value="USD" className="bg-[#1a2333] text-white">USD</option>
        <option value="EUR" className="bg-[#1a2333] text-white">EUR</option>
      </select>
      
      {/* Custom dropdown arrow */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50 ltr:block rtl:hidden">
        <svg fill="currentColor" viewBox="0 0 20 20" className="w-3 h-3 text-white"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"></path></svg>
      </div>
      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50 hidden rtl:block">
        <svg fill="currentColor" viewBox="0 0 20 20" className="w-3 h-3 text-white"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"></path></svg>
      </div>
    </div>
  );
}
