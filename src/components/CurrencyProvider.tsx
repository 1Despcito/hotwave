'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Currency = 'EUR';

type CurrencyContextType = {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (amount: number | null | undefined) => string;
};

const symbols = {
  EUR: '€'
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('EUR');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Force EUR even if EGP was saved before
    localStorage.setItem('hotwave_currency', 'EUR');
  }, []);

  const handleSetCurrency = (c: Currency) => {
    setCurrency('EUR');
  };

  const formatPrice = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return '';
    
    // Always return as Euro without conversion (1:1 with DB value)
    return `${symbols.EUR}${Number(amount).toFixed(2)}`;
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
