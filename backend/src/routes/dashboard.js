const express = require('express');
const router = express.Router();
const pool = require('../db/database');

// Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    // Total detection count
    const totalResult = await pool.query(`
      SELECT COUNT(*) as total FROM detection_jobs WHERE status = 'completed'
    `);
    const totalDetections = parseInt(totalResult.rows[0].total) || 0;

    // Risk tier distribution
    const riskDistributionResult = await pool.query(`
      SELECT risk_tier, COUNT(*) as count
      FROM security_test_results
      GROUP BY risk_tier
    `);
    const riskDistribution = riskDistributionResult.rows.map((row) => ({
      name: row.risk_tier || 'UNKNOWN',
      value: parseInt(row.count) || 0,
    }));

    // Recent trends (last 7 days)
    // SQLite compatible query
    const trendsResult = await pool.query(`
      SELECT 
        date(created_at) as date,
        AVG(risk_score) as avg_score,
        COUNT(*) as total
      FROM security_test_results
      WHERE created_at >= datetime('now', '-7 days')
      GROUP BY date(created_at)
      ORDER BY date ASC
    `);
    const recentTrends = trendsResult.rows.map((row) => ({
      date: new Date(row.date).toISOString().split('T')[0],
      avgScore: Math.round(parseFloat(row.avg_score) || 0),
      total: parseInt(row.total) || 0,
    }));

    // Compliance status overview
    // SQLite compatible query (using CASE WHEN instead of FILTER)
    const complianceResult = await pool.query(`
      SELECT 
        'NIST AI RMF' as name,
        SUM(CASE WHEN nist_ai_rmf_status = 'passed' THEN 1 ELSE 0 END) as passed,
        SUM(CASE WHEN nist_ai_rmf_status != 'passed' OR nist_ai_rmf_status IS NULL THEN 1 ELSE 0 END) as failed
      FROM compliance_results
      UNION ALL
      SELECT 
        'EU AI Act',
        SUM(CASE WHEN eu_ai_act_status = 'passed' THEN 1 ELSE 0 END) as passed,
        SUM(CASE WHEN eu_ai_act_status != 'passed' OR eu_ai_act_status IS NULL THEN 1 ELSE 0 END) as failed
      FROM compliance_results
      UNION ALL
      SELECT 
        'ISO 42001',
        SUM(CASE WHEN iso_42001_status = 'passed' THEN 1 ELSE 0 END) as passed,
        SUM(CASE WHEN iso_42001_status != 'passed' OR iso_42001_status IS NULL THEN 1 ELSE 0 END) as failed
      FROM compliance_results
      UNION ALL
      SELECT 
        'UNESCO',
        SUM(CASE WHEN unesco_status = 'passed' THEN 1 ELSE 0 END) as passed,
        SUM(CASE WHEN unesco_status != 'passed' OR unesco_status IS NULL THEN 1 ELSE 0 END) as failed
      FROM compliance_results
      UNION ALL
      SELECT 
        'UN 10 Principles',
        SUM(CASE WHEN un_10_principles_status = 'passed' THEN 1 ELSE 0 END) as passed,
        SUM(CASE WHEN un_10_principles_status != 'passed' OR un_10_principles_status IS NULL THEN 1 ELSE 0 END) as failed
      FROM compliance_results
    `);

    const complianceStatus = complianceResult.rows.map((row) => ({
      name: row.name,
      passed: parseInt(row.passed) || 0,
      failed: parseInt(row.failed) || 0,
    }));

    res.json({
      totalDetections,
      riskDistribution,
      recentTrends,
      complianceStatus,
    });
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

module.exports = router;
