import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',         // your postgres username
  host: 'localhost',        // or your server IP
  database: 'vef2quiz',     // the DB you created
  password: '12345',
  port: 5432,               // default port
});

export default pool;
