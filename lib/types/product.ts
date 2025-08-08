export interface Product {
  id: string;
  name: string;
  dimensions_w_cm: number;
  dimensions_h_cm: number;
  dimensions_label: string;
  type: string;
  price_gbp_pennies: number;
  notes?: string | null;
  image_path: string;
  is_for_sale: boolean;
  is_sold: boolean;
  stripe_product_id?: string | null;
  stripe_price_id?: string | null;
  created_at: string;
  updated_at: string;
}


