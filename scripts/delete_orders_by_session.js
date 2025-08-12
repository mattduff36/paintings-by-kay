#!/usr/bin/env node
const { Pool } = require('pg');

async function main() {
  const ids = process.argv.slice(2);
  if (ids.length === 0) {
    console.error('Usage: node scripts/delete_orders_by_session.js <session_id> [more_ids...]');
    process.exit(1);
  }
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('DATABASE_URL not set');
    process.exit(1);
  }
  const pool = new Pool({ connectionString, max: 1, ssl: { rejectUnauthorized: false } });
  const client = await pool.connect();
  try {
    const placeholders = ids.map((_, i) => `$${i + 1}`).join(',');
    const res = await client.query(`delete from orders where stripe_session_id in (${placeholders})`, ids);
    console.log(`Deleted ${res.rowCount} orders.`);
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


