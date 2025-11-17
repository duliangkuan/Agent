const pool = require('./database-sqlite');
const { createTables } = require('./migrate-sqlite');
const { seedData } = require('./seed-sqlite');

// Complete database initialization process
const initDatabase = async () => {
  try {
    console.log('=== Starting database initialization ===\n');

    // Step 1: Test connection
    console.log('Step 1/3: Testing database connection...');
    const connected = await pool.testConnection();
    if (!connected) {
      throw new Error('Unable to connect to database');
    }
    console.log('✓ Database connection successful\n');

    // Step 2: Create tables
    console.log('Step 2/3: Creating database tables...');
    await createTables();
    console.log('✓ Database tables created successfully\n');

    // Step 3: Seed data (optional)
    console.log('Step 3/3: Seeding data...');
    await seedData();
    console.log('✓ Seed data completed\n');

    console.log('=== Database initialization completed ===');
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('Database initialization failed:', error);
    console.error('\nPlease check:');
    console.error('1. Is the database file path correct?');
    console.error('2. Do you have write permissions?');
    await pool.end();
    process.exit(1);
  }
};

// If running this script directly
if (require.main === module) {
  initDatabase();
}

module.exports = { initDatabase };
