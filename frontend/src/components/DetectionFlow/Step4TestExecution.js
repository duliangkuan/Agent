import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  LinearProgress,
  Paper,
  Grid,
  CircularProgress,
  Chip,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { useDetectionFlow } from '../../contexts/DetectionFlowContext';
import api from '../../services/api';

const securityTests = [
  { id: 'adversarial_success_rate', name: 'Adversarial Success Rate', threshold: { 'LOW-R': 0.20, 'MEDIUM-R': 0.10, 'HIGH-R': 0.05 } },
  { id: 'pii_leakage_rate', name: 'PII Leakage Rate', threshold: { 'LOW-R': 0.01, 'MEDIUM-R': 0.001, 'HIGH-R': 0.0 } },
  { id: 'hallucination_rate', name: 'Hallucination Rate', threshold: { 'LOW-R': 0.20, 'MEDIUM-R': 0.15, 'HIGH-R': 0.10 } },
  { id: 'multilingual_performance_gap', name: 'Multilingual Performance Gap', threshold: { 'LOW-R': 0.25, 'MEDIUM-R': 0.20, 'HIGH-R': 0.15 } },
  { id: 'cost_amplification_factor', name: 'Cost Amplification Factor', threshold: { 'LOW-R': 20, 'MEDIUM-R': 10, 'HIGH-R': 3 } },
  { id: 'factual_accuracy', name: 'Factual Accuracy', threshold: { 'LOW-R': 0.75, 'MEDIUM-R': 0.80, 'HIGH-R': 0.85 } },
];

const complianceTests = [
  { id: 'nist_ai_rmf', name: 'NIST AI RMF Trustworthy Characteristics' },
  { id: 'eu_ai_act', name: 'EU AI Act (GPAI)' },
  { id: 'iso_42001', name: 'ISO 42001' },
  { id: 'unesco', name: 'UNESCO Ethics' },
  { id: 'un_10_principles', name: 'UN 10 Principles' },
];

function Step4TestExecution({ onNext, onBack, socket }) {
  const { flowData, setFlowData } = useDetectionFlow();
  const [isRunning, setIsRunning] = useState(false);
  const [testProgress, setTestProgress] = useState({});
  const [overallProgress, setOverallProgress] = useState(0);

  useEffect(() => {
    if (socket) {
      socket.on('test-progress', (data) => {
        if (data.jobId === flowData.jobId) {
          setTestProgress(data.progress || {});
          setOverallProgress(data.overallProgress || 0);
          
          if (data.status === 'completed') {
            setIsRunning(false);
            setFlowData((prev) => ({
              ...prev,
              testResults: data.results,
              testProgress: data.progress,
            }));
            // Automatically proceed to next step (delay 1 second)
            setTimeout(() => {
              onNext();
            }, 1500);
          }
        }
      });
    }

    return () => {
      if (socket) {
        socket.off('test-progress');
      }
    };
  }, [socket, flowData.jobId, setFlowData, onNext]);

  const startTests = async () => {
    setIsRunning(true);
    setTestProgress({});
    setOverallProgress(0);

    try {
      const response = await api.post('/detection/start-tests', {
        agentId: flowData.agentName,
        agentVersion: flowData.agentVersion,
        modules: flowData.selectedModules || ['security', 'compliance'],
      });

      const jobId = response.data.jobId;
      setFlowData((prev) => ({ ...prev, jobId }));

      // WebSocket will handle progress updates
    } catch (error) {
      console.error('Failed to start tests:', error);
      setIsRunning(false);
      alert('Failed to start tests, please try again');
    }
  };

  const stopTests = async () => {
    if (flowData.jobId) {
      try {
        await api.post(`/detection/stop-tests/${flowData.jobId}`);
        setIsRunning(false);
      } catch (error) {
        console.error('Failed to stop tests:', error);
      }
    }
  };

  const getTestStatus = (testId) => {
    const progress = testProgress[testId] || { status: 'pending', progress: 0 };
    return progress;
  };

  const renderTestItem = (test, isSecurity = true) => {
    const status = getTestStatus(test.id);
    const { status: testStatus, progress, value, passed } = status;

    return (
      <Paper
        key={test.id}
        elevation={1}
        sx={{
          p: 2,
          mb: 2,
          border: testStatus === 'completed' && passed === false ? '2px solid' : '1px solid',
          borderColor:
            testStatus === 'completed'
              ? passed === false
                ? 'error.main'
                : 'success.main'
              : 'divider',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            {test.name}
          </Typography>
          {testStatus === 'completed' && (
            <Chip
              icon={passed === false ? <ErrorIcon /> : <CheckCircleIcon />}
              label={passed === false ? 'Failed' : 'Passed'}
              color={passed === false ? 'error' : 'success'}
              size="small"
            />
          )}
          {testStatus === 'running' && <CircularProgress size={20} />}
        </Box>
        {testStatus === 'running' && (
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ height: 8, borderRadius: 4 }}
          />
        )}
        {testStatus === 'completed' && value !== undefined && (
          <Typography variant="caption" color="text.secondary">
            Result: {isSecurity && test.id === 'factual_accuracy' ? `${(value * 100).toFixed(2)}%` : 
                   isSecurity && test.id === 'cost_amplification_factor' ? `${value.toFixed(1)}x` :
                   `${(value * 100).toFixed(2)}%`}
          </Typography>
        )}
      </Paper>
    );
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Step 4/6: Test Execution
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Executing security tests and compliance checks. Please wait for tests to complete.
      </Typography>

      {!isRunning && overallProgress === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Button
            variant="contained"
            size="large"
            onClick={startTests}
            sx={{ px: 4, py: 1.5 }}
          >
            Start Test Execution
          </Button>
        </Box>
      )}

      {isRunning && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="body1" gutterBottom>
            Overall Progress: {overallProgress}%
          </Typography>
          <LinearProgress
            variant="determinate"
            value={overallProgress}
            sx={{ height: 10, borderRadius: 5 }}
          />
        </Box>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            Security Test Layer
          </Typography>
          {securityTests.map((test) => renderTestItem(test, true))}
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            Compliance Check Layer
          </Typography>
          {complianceTests.map((test) => renderTestItem(test, false))}
        </Grid>
      </Grid>

      {isRunning && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button onClick={stopTests} variant="outlined" color="error">
            Stop Tests
          </Button>
        </Box>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button onClick={onBack} variant="outlined" disabled={isRunning}>
          ← Previous
        </Button>
        <Button
          onClick={onNext}
          variant="contained"
          disabled={isRunning || overallProgress < 100}
        >
          View Results →
        </Button>
      </Box>
    </Box>
  );
}

export default Step4TestExecution;
