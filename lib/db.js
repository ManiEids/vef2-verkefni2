
import pkg from 'pg';
const { Pool } = pkg;


const connectionString = process.env.DATABASE_URL
  || 'postgres://postgres:YOUR_LOCAL_PASSWORD@localhost:5432/vef2quiz';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'vef2quiz',
  password: '12345',
  port: 5432,
});

export default pool;
