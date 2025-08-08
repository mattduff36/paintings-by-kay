import { getSupabaseAdmin } from '@/lib/supabase/server';
import type { Product } from '@/lib/types/product';

const TABLE = 'products';

export async function getProductsForSale(): Promise<Product[]> {
  const db = getSupabaseAdmin();
  const { data, error } = await db.from(TABLE).select('*').eq('is_for_sale', true).order('created_at', { ascending: false });
  if (error) throw error;
  return (data as Product[]) || [];
}

export async function getAllProducts(): Promise<Product[]> {
  const db = getSupabaseAdmin();
  const { data, error } = await db.from(TABLE).select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return (data as Product[]) || [];
}

export async function getProductById(id: string): Promise<Product | null> {
  const db = getSupabaseAdmin();
  const { data, error } = await db.from(TABLE).select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return (data as Product) || null;
}

export async function createProduct(input: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'is_sold' | 'is_for_sale'> & { is_for_sale?: boolean }): Promise<Product> {
  const db = getSupabaseAdmin();
  const { data, error } = await db.from(TABLE).insert({ ...input }).select('*').single();
  if (error) throw error;
  return data as Product;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
  const db = getSupabaseAdmin();
  const { data, error } = await db.from(TABLE).update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select('*').single();
  if (error) throw error;
  return data as Product;
}

export async function deleteProduct(id: string): Promise<void> {
  const db = getSupabaseAdmin();
  const { error } = await db.from(TABLE).delete().eq('id', id);
  if (error) throw error;
}

export async function markSold(id: string): Promise<void> {
  const db = getSupabaseAdmin();
  const { error } = await db.from(TABLE).update({ is_sold: true, is_for_sale: false, updated_at: new Date().toISOString() }).eq('id', id);
  if (error) throw error;
}


