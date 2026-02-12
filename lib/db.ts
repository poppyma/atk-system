import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

export async function executeQuery(query: string, params?: any[]) {
  const client = await pool.connect();
  try {
    const result = await client.query(query, params);
    return result.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw error;
  } finally {
    client.release();
  }
}

export default pool;
// import { Pool } from "pg"; 
// // Database connection pool 
// const pool = new Pool({ user: process.env.DB_USER || "postgres", password: process.env.DB_PASSWORD || "", host: process.env.DB_HOST || "localhost", port: parseInt(process.env.DB_PORT || "5432"), database: process.env.DB_NAME || "master_atk", }); export async function executeQuery( query: string, params?: any[] ) { const client = await pool.connect(); try { const result = await client.query(query, params); return result.rows; } catch (error) { console.error("Database Error:", error); throw error; } finally { client.release(); } } export default pool;
