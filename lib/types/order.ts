export interface Order {
  id: string;
  order_number: number;
  stripe_session_id: string;
  product_id: string;
  product_name: string;
  price_gbp_pennies: number;
  customer_email: string;
  customer_name: string | null;
  customer_phone: string | null;
  shipping_line1: string | null;
  shipping_line2: string | null;
  shipping_city: string | null;
  shipping_postal_code: string | null;
  shipping_country: string | null;
  amount_total_pennies: number;
  status: 'paid' | 'despatched' | 'cancelled' | 'failed' | 'initiated';
  created_at: string;
  updated_at: string;
  despatched_at: string | null;
  tracking_number: string | null;
}


