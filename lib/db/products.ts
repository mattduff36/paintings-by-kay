import type { Product } from '@/lib/types/product';
import { ensureProductsTable, pgQuery } from '@/lib/db/pg';
import { v4 as uuidv4 } from 'uuid';

const SELECT_ALL = `
  select id, name, dimensions_w_cm, dimensions_h_cm, dimensions_label, type,
         price_gbp_pennies, notes, image_path, is_for_sale, is_sold,
         stripe_product_id, stripe_price_id, created_at, updated_at
  from products
`;

export async function getProductsForSale(): Promise<Product[]> {
  await ensureProductsTable();
  const { rows } = await pgQuery<Product>(`${SELECT_ALL} where is_for_sale = true order by created_at desc`);
  return rows;
}

export async function getAllProducts(): Promise<Product[]> {
  await ensureProductsTable();
  const { rows } = await pgQuery<Product>(`${SELECT_ALL} order by created_at desc`);
  return rows;
}

export async function getProductById(id: string): Promise<Product | null> {
  await ensureProductsTable();
  const { rows } = await pgQuery<Product>(`${SELECT_ALL} where id = $1`, [id]);
  return rows[0] || null;
}

export async function createProduct(input: Omit<Product, 'id' | 'created_at' | 'updated_at'> & { is_for_sale?: boolean; is_sold?: boolean }): Promise<Product> {
  await ensureProductsTable();
  const id = uuidv4();
  const now = new Date().toISOString();
  const { rows } = await pgQuery<Product>(
    `insert into products (
      id, name, dimensions_w_cm, dimensions_h_cm, dimensions_label, type,
      price_gbp_pennies, notes, image_path, is_for_sale, is_sold,
      stripe_product_id, stripe_price_id, created_at, updated_at
    ) values (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,null,null,$12,$12
    ) returning *`,
    [
      id,
      input.name,
      input.dimensions_w_cm,
      input.dimensions_h_cm,
      input.dimensions_label,
      input.type,
      input.price_gbp_pennies,
      input.notes ?? null,
      input.image_path,
      Boolean(input.is_for_sale ?? false),
      Boolean(input.is_sold ?? false),
      now,
    ],
  );
  return rows[0];
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
  await ensureProductsTable();
  const setParts: string[] = [];
  const values: any[] = [];
  let idx = 1;
  for (const [key, value] of Object.entries(updates)) {
    setParts.push(`${key} = $${idx++}`);
    values.push(value);
  }
  setParts.push(`updated_at = $${idx}`);
  values.push(new Date().toISOString());
  const { rows } = await pgQuery<Product>(
    `update products set ${setParts.join(', ')} where id = $${idx + 1} returning *`,
    [...values, id],
  );
  return rows[0];
}

export async function deleteProduct(id: string): Promise<void> {
  await ensureProductsTable();
  await pgQuery(`delete from products where id = $1`, [id]);
}

export async function markSold(id: string): Promise<boolean> {
  await ensureProductsTable();
  const { rows } = await pgQuery<Product>(
    `update products set is_sold = true, is_for_sale = false, updated_at = now() where id = $1 and is_sold = false returning *`,
    [id],
  );
  return rows.length > 0;
}


