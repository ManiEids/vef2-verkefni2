import pkg from 'pg';
const { Pool } = pkg;

const connectionString = process.env.DATABASE_URL
  || 'postgres://postgres:YOUR_LOCAL_PASSWORD@localhost:5432/vef2quiz';


const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false, // ssl ver- stoppa
  },
});

export default pool;
