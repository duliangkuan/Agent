require('dotenv').config();

// Select database type based on environment variables
// Set DB_TYPE=sqlite to use SQLite, otherwise use PostgreSQL
const useSQLite = process.env.DB_TYPE === 'sqlite' || (!process.env.DATABASE_URL && !process.env.DB_HOST);

let pool;
if (useSQLite) {
  console.log('Using SQLite database');
  pool = require('./database-sqlite');
} else {
  console.log('Using PostgreSQL database');
  const { Pool } = require('pg');
  
  // Parse database connection string or use separate configuration
  let poolConfig;

  if (process.env.DATABASE_URL) {
    // Use connection string
    poolConfig = {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    };
  } else {
    // Use separate configuration (for local development)
    poolConfig = {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      database: process.env.DB_NAME || 'agent_security',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
    };
  }

  const pgPool = new Pool(poolConfig);

  // Test database connection
  pgPool.on('connect', () => {
    console.log('Database connection successful');
  });

  pgPool.on('error', (err) => {
    console.error('Unexpected database client error', err);
    // Don't exit process in development environment, allow auto-reconnect
    if (process.env.NODE_ENV === 'production') {
      process.exit(-1);
    }
  });

  // Add test connection method
  pgPool.testConnection = async () => {
    try {
      const client = await pgPool.connect();
      const result = await client.query('SELECT NOW()');
      client.release();
      console.log('Database connection test successful:', result.rows[0].now);
      return true;
    } catch (error) {
      console.error('Database connection test failed:', error.message);
      return false;
    }
  };

  pool = pgPool;
}

module.exports = pool;
