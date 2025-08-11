import type { Product } from '@/lib/types/product';
import { BuyButton } from './product-buy-button';

interface ProductCardProps {
  product: Product;
  frontSrc?: string; // optional alternate/front image for fullscreen
}

export function ProductCard({ product, frontSrc }: ProductCardProps) {
  const price = `£${(product.price_gbp_pennies / 100).toLocaleString('en-GB')}`;
  const id = product.image_path.match(/gallery\/(?:desktop|mobile|tablet)\/(.*)\.(?:webp|jpg|jpeg|png)$/i)?.[1] || '';
  return (
    <div className="relative overflow-hidden rounded shadow">
      <picture>
        <source media="(max-width: 768px)" srcSet={product.image_path.replace('/desktop/', '/mobile/')} />
        <source media="(max-width: 1024px)" srcSet={product.image_path.replace('/desktop/', '/tablet/')} />
        <img
          src={product.image_path}
          alt={product.name}
          loading="lazy"
          data-front-src={frontSrc || ''}
          data-name={product.name}
          data-type={product.type}
          data-dimensions={product.dimensions_label}
          data-price={price}
          data-product-id={product.id}
          data-is-sold={String(product.is_sold)}
          data-is-for-sale={String(product.is_for_sale)}
          className="shop-image"
        />
      </picture>
      <div className="absolute right-2 top-2 rounded bg-white/80 px-2 py-1 text-[10px] font-medium text-gray-800">Free UK P&P</div>
      {product.is_sold && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-700/70 text-2xl font-semibold text-white">Sold</div>
      )}
      <div className="space-y-1 p-3">
        <div className="text-lg font-medium">{product.name}</div>
        <div className="text-sm text-gray-600">{product.dimensions_label} • {product.type}</div>
        <div className="flex items-center justify-between">
          <div className="font-medium">{price}</div>
          {!product.is_sold && product.is_for_sale ? <BuyButton productId={product.id} /> : null}
        </div>
      </div>
    </div>
  );
}


