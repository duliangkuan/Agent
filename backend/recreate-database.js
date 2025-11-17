const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = require('./src/db/database-sqlite');
const { createTables } = require('./src/db/migrate-sqlite');
const { seedData } = require('./src/db/seed-sqlite');

// Main function: recreate database
const recreateDatabase = async () => {
  const dbPath = process.env.DB_PATH || path.join(__dirname, 'data/agent_security.db');
  
  console.log('=== Recreating Local Database ===\n');
  console.log(`Target database: ${dbPath}\n`);

  try {
    // Step 1: Delete old database file
    console.log('Step 1/4: Deleting old database...');
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
      console.log(`  ✓ Old database file deleted\n`);
    } else {
      console.log(`  ✓ Database file does not exist, will create new file\n`);
    }

    // Step 2: Ensure data directory exists
    console.log('Step 2/4: Creating data directory...');
    const dbDir = path.dirname(dbPath);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
      console.log(`  ✓ Data directory created: ${dbDir}\n`);
    } else {
      console.log(`  ✓ Data directory already exists\n`);
    }

    // Step 3: Create tables
    console.log('Step 3/4: Creating database tables...');
    await createTables();
    console.log('  ✓ Database tables created successfully\n');

    // Step 4: Populate seed data
    console.log('Step 4/4: Populating seed data...');
    await seedData();
    console.log('  ✓ Seed data population completed\n');

    console.log('=== Database Recreation Completed ===\n');
    console.log('Database Information:');
    console.log(`  - Database file: ${dbPath}`);
    console.log(`  - Table count: 6 (agents, detection_jobs, security_test_results, compliance_results, reports, evidences)`);
    console.log(`  - Status: Initialized and populated with sample data\n`);

    await pool.end();
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nPlease check:');
    console.error('1. Database file path is correct');
    console.error('2. Write permissions are granted');
    console.error('3. Data directory exists\n');
    
    await pool.end();
    process.exit(1);
  }
};

// Run script
if (require.main === module) {
  recreateDatabase();
}

module.exports = { recreateDatabase };
