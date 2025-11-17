const { v4: uuidv4 } = require('uuid');
const pool = require('../db/database');
const riskCalculator = require('./riskCalculator');
const testExecutor = require('./testExecutor');

class DetectionService {
  constructor() {
    this.runningJobs = new Map();
  }

  async startTests(jobId, agentName, agentVersion, modules, io) {
    // Create detection job record
    // SQLite compatible: convert array to JSON string, use datetime('now')
    const modulesJson = JSON.stringify(modules);
    const jobResult = await pool.query(
      `INSERT INTO detection_jobs (job_id, agent_name, agent_version, status, selected_modules, started_at)
       VALUES ($1, $2, $3, $4, $5, datetime('now'))
       RETURNING id`,
      [jobId, agentName, agentVersion, 'running', modulesJson]
    );

    const dbJobId = jobResult.rows[0].id;

    // Start test execution (async)
    this.runTests(jobId, dbJobId, agentName, agentVersion, modules, io);
  }

  async runTests(jobId, dbJobId, agentName, agentVersion, modules, io) {
    this.runningJobs.set(jobId, { status: 'running', dbJobId });

    try {
      const progress = {
        security: {},
        compliance: {},
      };
      const results = {
        security: {},
        compliance: {},
      };

      // Execute security test layer
      if (modules.includes('security')) {
        for (const test of testExecutor.securityTests) {
          const result = await this.runSecurityTest(test, progress, io, jobId);
          results.security[test.id] = result;
        }
      }

      // Execute compliance check layer
      if (modules.includes('compliance')) {
        for (const test of testExecutor.complianceTests) {
          const result = await this.runComplianceTest(test, progress, io, jobId);
          results.compliance[test.id] = result;
        }
      }

      // Calculate risk score
      const riskResult = riskCalculator.calculateRiskScore(results.security);

      // Save results to database
      await this.saveResults(dbJobId, results, riskResult);

      // Send completion notification
      io.emit('test-progress', {
        jobId,
        status: 'completed',
        progress: progress,
        results: results,
        riskScore: riskResult.riskScore,
        riskTier: riskResult.riskTier,
        overallProgress: 100,
      });

      // Update job status
      await pool.query(
        `UPDATE detection_jobs SET status = $1, completed_at = datetime('now') WHERE id = $2`,
        ['completed', dbJobId]
      );

      this.runningJobs.delete(jobId);
    } catch (error) {
      console.error('Test execution failed:', error);
      io.emit('test-progress', {
        jobId,
        status: 'failed',
        error: error.message,
      });
      await pool.query(
        `UPDATE detection_jobs SET status = $1, completed_at = datetime('now') WHERE id = $2`,
        ['failed', dbJobId]
      );
      this.runningJobs.delete(jobId);
    }
  }

  async runSecurityTest(test, progress, io, jobId) {
    // Send start notification
    progress.security[test.id] = { status: 'running', progress: 0 };
    io.emit('test-progress', { jobId, progress, overallProgress: this.calculateOverallProgress(progress) });

    // Simulate test execution (with delay)
    for (let i = 0; i <= 100; i += 20) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      progress.security[test.id].progress = i;
      io.emit('test-progress', { jobId, progress, overallProgress: this.calculateOverallProgress(progress) });
    }

    // Generate mock results
    const result = testExecutor.executeSecurityTest(test);
    
    // Update progress
    progress.security[test.id] = {
      status: 'completed',
      progress: 100,
      value: result.value,
      passed: result.passed,
    };

    io.emit('test-progress', { jobId, progress, overallProgress: this.calculateOverallProgress(progress) });

    return result;
  }

  async runComplianceTest(test, progress, io, jobId) {
    // Send start notification
    progress.compliance[test.id] = { status: 'running', progress: 0 };
    io.emit('test-progress', { jobId, progress, overallProgress: this.calculateOverallProgress(progress) });

    // Simulate test execution (with delay)
    for (let i = 0; i <= 100; i += 25) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      progress.compliance[test.id].progress = i;
      io.emit('test-progress', { jobId, progress, overallProgress: this.calculateOverallProgress(progress) });
    }

    // Generate mock results
    const result = testExecutor.executeComplianceTest(test);
    
    // Update progress
    progress.compliance[test.id] = {
      status: 'completed',
      progress: 100,
      ...result,
    };

    io.emit('test-progress', { jobId, progress, overallProgress: this.calculateOverallProgress(progress) });

    return result;
  }

  calculateOverallProgress(progress) {
    let total = 0;
    let completed = 0;

    // Security test progress
    Object.values(progress.security || {}).forEach((test) => {
      total += 100;
      completed += test.progress || 0;
    });

    // Compliance check progress
    Object.values(progress.compliance || {}).forEach((test) => {
      total += 100;
      completed += test.progress || 0;
    });

    return total > 0 ? Math.round((completed / total) * 100) : 0;
  }

  async saveResults(dbJobId, results, riskResult) {
    // Save security test results
    if (results.security && Object.keys(results.security).length > 0) {
      const security = results.security;
      await pool.query(
        `INSERT INTO security_test_results (
          job_id, adversarial_success_rate, pii_leakage_rate, hallucination_rate,
          multilingual_performance_gap, cost_amplification_factor, factual_accuracy,
          risk_score, risk_tier
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          dbJobId,
          security.adversarial_success_rate?.value,
          security.pii_leakage_rate?.value,
          security.hallucination_rate?.value,
          security.multilingual_performance_gap?.value,
          security.cost_amplification_factor?.value,
          security.factual_accuracy?.value,
          riskResult.riskScore,
          riskResult.riskTier,
        ]
      );
    }

    // Save compliance check results
    if (results.compliance && Object.keys(results.compliance).length > 0) {
      const compliance = results.compliance;
      await pool.query(
        `INSERT INTO compliance_results (
          job_id, nist_ai_rmf_score, nist_ai_rmf_status,
          eu_ai_act_coverage, eu_ai_act_status,
          iso_42001_level, iso_42001_status,
          unesco_status, un_10_principles_coverage, un_10_principles_status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          dbJobId,
          compliance.nist_ai_rmf?.score,
          compliance.nist_ai_rmf?.status,
          compliance.eu_ai_act?.coverage,
          compliance.eu_ai_act?.status,
          compliance.iso_42001?.level,
          compliance.iso_42001?.status,
          compliance.unesco?.status,
          compliance.un_10_principles?.coverage,
          compliance.un_10_principles?.status,
        ]
      );
    }
  }

  stopTests(jobId) {
    const job = this.runningJobs.get(jobId);
    if (job) {
      job.status = 'stopped';
      this.runningJobs.delete(jobId);
    }
  }
}

module.exports = new DetectionService();
