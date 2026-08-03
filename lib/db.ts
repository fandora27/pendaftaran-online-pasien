import mysql from 'mysql2/promise';

// Konfigurasi koneksi database MySQL
// Sesuaikan dengan pengaturan XAMPP/Laragon Anda
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'pmb_griya_bunda',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Membuat connection pool
let pool: mysql.Pool | null = null;

function getPool() {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
  }
  return pool;
}

// Check if database is available
export async function isDatabaseAvailable(): Promise<boolean> {
  try {
    const p = getPool();
    await p.execute('SELECT 1');
    return true;
  } catch {
    return false;
  }
}

// Helper function untuk menjalankan query
export async function query<T>(sql: string, params?: unknown[]): Promise<T> {
  const p = getPool();
  const [results] = await p.execute(sql, params);
  return results as T;
}

// Helper untuk mendapatkan koneksi tunggal (untuk transaksi)
export async function getConnection() {
  return await getPool().getConnection();
}

export default { getPool, query, getConnection, isDatabaseAvailable };
