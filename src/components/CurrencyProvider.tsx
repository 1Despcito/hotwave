'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Currency = 'EGP' | 'USD' | 'EUR';

type CurrencyContextType = {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (amount: number | null | undefined) => string;
};

// Mock exchange rates (1 EGP = ? target)
// We assume DB stores prices in USD, EUR or EGP? Let's assume DB stores prices in USD because tourism in Egypt usually prices in USD or EUR.
// Wait, if the DB stores in EGP, 1 USD = 50 EGP.
// Let's assume DB stores prices in EGP to be safe, because local payments are EGP.
const rates = {
  EGP: 1,
  USD: 1 / 50.1,    // Ex: 50 EGP = 1 USD
  EUR: 1 / 54.5,    // Ex: 54.5 EGP = 1 EUR
};

const symbols = {
  EGP: 'ج.م',
  USD: '$',
  EUR: '€'
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('EGP');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('hotwave_currency') as Currency;
    if (saved && (saved === 'EGP' || saved === 'USD' || saved === 'EUR')) {
      setCurrency(saved);
    }
  }, []);

  const handleSetCurrency = (c: Currency) => {
    setCurrency(c);
    localStorage.setItem('hotwave_currency', c);
  };

  const formatPrice = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return '';
    
    // If not mounted yet, render default to avoid hydration mismatch
    if (!mounted) return `${amount} ${symbols['EGP']}`;

    if (currency === 'EGP') return `${amount} ${symbols.EGP}`;
    
    const converted = amount * rates[currency];
    // Return formatted without too many decimals for large numbers, 2 dec for USD/EUR
    return `${symbols[currency]}${converted.toFixed(2)}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency: handleSetCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
