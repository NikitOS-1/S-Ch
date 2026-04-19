import type { Product } from "../model/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div>
      <p className="text-lg font-semibold text-slate-900">{product.name}</p>
      <p className="text-2xl font-bold text-slate-900">{product.priceDisplay}</p>
      <p className="text-sm text-slate-500">{product.description}</p>
    </div>
  );
}
