'use client';
import { useCurrency } from '@/components/CurrencyProvider';

export function PriceDisplay({ price, className }: { price: number | null | undefined; className?: string }) {
  const { formatPrice } = useCurrency();
  if (!price) return null;
  return <span className={className}>{formatPrice(price)}</span>;
}
