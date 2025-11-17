const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const detectionService = require('../services/detectionService');

// Identify CCL
router.post('/identify-ccl', async (req, res) => {
  try {
    const { agentName, agentVersion, agentType } = req.body;
    
    // Simulate CCL identification logic
    const cclList = ['CCL-001: Data Processing', 'CCL-002: User Interaction'];
    
    res.json({ cclList });
  } catch (error) {
    console.error('CCL identification failed:', error);
    res.status(500).json({ error: 'CCL identification failed' });
  }
});

// Start tests
router.post('/start-tests', async (req, res) => {
  try {
    const { agentId, agentVersion, modules } = req.body;
    const io = req.app.get('io');
    
    const jobId = uuidv4();
    
    // Start background test task
    detectionService.startTests(jobId, agentId, agentVersion, modules, io);
    
    res.json({ jobId, status: 'started' });
  } catch (error) {
    console.error('Failed to start tests:', error);
    res.status(500).json({ error: 'Failed to start tests' });
  }
});

// Stop tests
router.post('/stop-tests/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;
    
    // Stop test task
    detectionService.stopTests(jobId);
    
    res.json({ status: 'stopped' });
  } catch (error) {
    console.error('Failed to stop tests:', error);
    res.status(500).json({ error: 'Failed to stop tests' });
  }
});

module.exports = router;
