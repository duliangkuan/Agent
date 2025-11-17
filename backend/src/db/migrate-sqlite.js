const pool = require('./database-sqlite');

const createTables = async () => {
  try {
    console.log('Testing database connection...');
    const connected = await pool.testConnection();
    if (!connected) {
      throw new Error('Unable to connect to database, please check configuration');
    }
    console.log('Database connection successful, starting to create tables...');
    
    // Agents table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS agents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(255) NOT NULL,
        version VARCHAR(50) NOT NULL,
        type VARCHAR(100),
        api_endpoint TEXT,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      )
    `);

    // Detection jobs table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS detection_jobs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        agent_id INTEGER REFERENCES agents(id),
        agent_name VARCHAR(255),
        agent_version VARCHAR(50),
        status VARCHAR(50) DEFAULT 'pending',
        ccl_list TEXT,
        selected_modules TEXT,
        job_id VARCHAR(100) UNIQUE,
        started_at TEXT,
        completed_at TEXT,
        created_at TEXT DEFAULT (datetime('now'))
      )
    `);

    // Security test results table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS security_test_results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        job_id INTEGER REFERENCES detection_jobs(id),
        adversarial_success_rate REAL,
        pii_leakage_rate REAL,
        hallucination_rate REAL,
        multilingual_performance_gap REAL,
        cost_amplification_factor REAL,
        factual_accuracy REAL,
        risk_score INTEGER,
        risk_tier VARCHAR(20),
        created_at TEXT DEFAULT (datetime('now'))
      )
    `);

    // Compliance check results table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS compliance_results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        job_id INTEGER REFERENCES detection_jobs(id),
        nist_ai_rmf_score INTEGER,
        nist_ai_rmf_status VARCHAR(50),
        eu_ai_act_coverage INTEGER,
        eu_ai_act_status VARCHAR(50),
        iso_42001_level INTEGER,
        iso_42001_status VARCHAR(50),
        unesco_status VARCHAR(50),
        un_10_principles_coverage INTEGER,
        un_10_principles_status VARCHAR(50),
        created_at TEXT DEFAULT (datetime('now'))
      )
    `);

    // Reports table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        job_id INTEGER REFERENCES detection_jobs(id),
        agent_name VARCHAR(255),
        agent_version VARCHAR(50),
        report_type VARCHAR(50) DEFAULT 'full',
        risk_score INTEGER,
        risk_tier VARCHAR(20),
        file_path TEXT,
        generated_at TEXT DEFAULT (datetime('now')),
        download_count INTEGER DEFAULT 0
      )
    `);

    // Evidences table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS evidences (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        job_id INTEGER REFERENCES detection_jobs(id),
        test_module VARCHAR(100),
        evidence_type VARCHAR(50),
        file_path TEXT,
        metadata TEXT,
        created_at TEXT DEFAULT (datetime('now'))
      )
    `);

    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Database migration failed:', error);
    throw error;
  }
};

// Execute migration
if (require.main === module) {
  createTables()
    .then(() => {
      console.log('Migration completed');
      pool.end();
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      pool.end();
      process.exit(1);
    });
}

module.exports = { createTables };
