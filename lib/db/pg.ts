import { Pool } from 'pg';

let pool: Pool | null = null;

export function getPgPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) throw new Error('DATABASE_URL is not set');
    pool = new Pool({ connectionString, max: 3, ssl: { rejectUnauthorized: false } });
  }
  return pool;
}

export async function pgQuery<T = any>(sql: string, params: any[] = []): Promise<{ rows: T[] }>
{
  const client = await getPgPool().connect();
  try {
    const res = await client.query(sql, params);
    return { rows: res.rows as T[] };
  } finally {
    client.release();
  }
}

export async function ensureProductsTable(): Promise<void> {
  await pgQuery(`
    create table if not exists products (
      id text primary key,
      name text not null,
      dimensions_w_cm int not null,
      dimensions_h_cm int not null,
      dimensions_label text not null,
      type text not null,
      price_gbp_pennies int not null,
      notes text null,
      image_path text not null unique,
      is_for_sale boolean not null default false,
      is_sold boolean not null default false,
      stripe_product_id text null,
      stripe_price_id text null,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );
  `);
}


