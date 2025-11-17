const pool = require('./database');

// Reset database (delete all tables, use with caution!)
const resetDatabase = async () => {
  try {
    console.log('Warning: This will delete all data tables!');
    console.log('Press Ctrl+C to cancel, or wait 5 seconds to continue...\n');

    // Wait 5 seconds
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Test connection
    const connected = await pool.testConnection();
    if (!connected) {
      throw new Error('Unable to connect to database');
    }

    // Delete all tables (note the order, due to foreign key constraints)
    const tables = [
      'evidences',
      'reports',
      'compliance_results',
      'security_test_results',
      'detection_jobs',
      'agents',
    ];

    console.log('Deleting tables...');
    for (const table of tables) {
      try {
        await pool.query(`DROP TABLE IF EXISTS ${table} CASCADE`);
        console.log(`✓ Deleted table: ${table}`);
      } catch (error) {
        console.log(`✗ Failed to delete table ${table}:`, error.message);
      }
    }

    console.log('\nDatabase reset completed');
    console.log('Please run "npm run db:init" to reinitialize the database');

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('Database reset failed:', error);
    await pool.end();
    process.exit(1);
  }
};

// If running this script directly
if (require.main === module) {
  resetDatabase();
}

module.exports = { resetDatabase };
