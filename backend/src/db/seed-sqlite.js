const pool = require('./database-sqlite');

// Seed data (optional, for development and testing)
const seedData = async () => {
  try {
    console.log('Starting to seed data...');

    // Test database connection
    const connected = await pool.testConnection();
    if (!connected) {
      throw new Error('Unable to connect to database, please check configuration');
    }

    // Check if data already exists
    try {
      const existingAgents = await pool.query('SELECT COUNT(*) as count FROM agents');
      if (parseInt(existingAgents.rows[0].count) > 0) {
        console.log('Database already contains data, skipping seed data');
        return;
      }
    } catch (error) {
      console.log('Table does not exist or is empty, starting to seed data...');
    }

    // Insert sample agents
    const agentResult = await pool.query(`
      INSERT INTO agents (name, version, type, api_endpoint)
      VALUES 
        ('Intelligent Customer Service Assistant', '1.0.0', 'chatbot', 'https://api.example.com/chatbot'),
        ('Data Analysis Agent', '2.1.0', 'analyst', 'https://api.example.com/analyst'),
        ('Translation Service', '1.5.2', 'translator', 'https://api.example.com/translator')
    `);
    console.log('Sample agent data inserted');

    // Get last inserted ID (SQLite way)
    const lastAgent = await pool.query('SELECT last_insert_rowid() as id');
    const agentId = lastAgent.rows[0]?.id || 1;

    // Insert sample detection job
    const cclList = JSON.stringify(['CCL-001: Data Processing', 'CCL-002: User Interaction']);
    const selectedModules = JSON.stringify(['security', 'compliance']);
    
    const jobResult = await pool.query(`
      INSERT INTO detection_jobs (
        agent_name, agent_version, status, ccl_list, selected_modules, job_id,
        started_at, completed_at
      )
      VALUES (?, ?, ?, ?, ?, ?, datetime('now', '-2 days'), datetime('now', '-2 days', '+30 minutes'))
    `, ['Intelligent Customer Service Assistant', '1.0.0', 'completed', cclList, selectedModules, 'sample-job-001']);
    
    const lastJob = await pool.query('SELECT last_insert_rowid() as id');
    const jobId = lastJob.rows[0]?.id || 1;

    // Insert sample security test results
    await pool.query(`
      INSERT INTO security_test_results (
        job_id, adversarial_success_rate, pii_leakage_rate, hallucination_rate,
        multilingual_performance_gap, cost_amplification_factor, factual_accuracy,
        risk_score, risk_tier
      )
      VALUES (
        ?, 0.15, 0.0005, 0.18, 0.12, 8.0, 0.82, 42, 'MEDIUM-R'
      )
    `, [jobId]);

    // Insert sample compliance check results
    await pool.query(`
      INSERT INTO compliance_results (
        job_id, nist_ai_rmf_score, nist_ai_rmf_status,
        eu_ai_act_coverage, eu_ai_act_status,
        iso_42001_level, iso_42001_status,
        unesco_status, un_10_principles_coverage, un_10_principles_status
      )
      VALUES (
        ?, 85, 'passed', 12, 'passed', 2, 'partial', 'passed', 9, 'passed'
      )
    `, [jobId]);

    // Insert sample report
    await pool.query(`
      INSERT INTO reports (job_id, agent_name, agent_version, risk_score, risk_tier, report_type)
      VALUES (?, 'Intelligent Customer Service Assistant', '1.0.0', 42, 'MEDIUM-R', 'full')
    `, [jobId]);

    console.log('Seed data completed');
  } catch (error) {
    console.error('Seed data failed:', error);
    throw error;
  }
};

// Execute seed data
if (require.main === module) {
  seedData()
    .then(() => {
      console.log('Seed data script execution completed');
      pool.end();
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seed data script execution failed:', error);
      pool.end();
      process.exit(1);
    });
}

module.exports = { seedData };
