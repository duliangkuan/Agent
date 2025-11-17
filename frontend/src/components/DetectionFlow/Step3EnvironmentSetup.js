import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import { useDetectionFlow } from '../../contexts/DetectionFlowContext';
import api from '../../services/api';

function Step3EnvironmentSetup({ onNext, onBack }) {
  const { flowData, setFlowData } = useDetectionFlow();
  const [status, setStatus] = useState('pending'); // pending, deploying, completed
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (status === 'pending') {
      startEnvironmentSetup();
    }
  }, [status]);

  const startEnvironmentSetup = async () => {
    setStatus('deploying');
    setProgress(0);
    setLogs([{ time: new Date(), message: 'Starting environment initialization...' }]);

    // Simulate environment setup process
    const steps = [
      { progress: 25, message: 'Deploying agent to test environment...' },
      { progress: 50, message: 'Loading test fixtures (PII data, attack prompts)...' },
      { progress: 75, message: 'Configuring monitoring system...' },
      { progress: 100, message: 'Environment setup completed!' },
    ];

    for (const step of steps) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setProgress(step.progress);
      setLogs((prev) => [
        ...prev,
        { time: new Date(), message: step.message },
      ]);
    }

    setStatus('completed');
    setFlowData((prev) => ({
      ...prev,
      environmentStatus: 'ready',
    }));
  };

  const environmentStatus = [
    {
      label: 'Agent Deployment',
      status:
        status === 'completed' || progress >= 25
          ? 'completed'
          : status === 'deploying'
          ? 'in-progress'
          : 'pending',
    },
    {
      label: 'Test Fixture Loading',
      status:
        status === 'completed' || progress >= 50
          ? 'completed'
          : status === 'deploying'
          ? 'in-progress'
          : 'pending',
    },
    {
      label: 'Monitoring Configuration',
      status:
        status === 'completed' || progress >= 75
          ? 'completed'
          : status === 'deploying'
          ? 'in-progress'
          : 'pending',
    },
  ];

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Step 3/6: Environment Setup
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Preparing test environment, including deploying agent, loading test data, and configuring monitoring system.
      </Typography>

      <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
          Environment Setup Status
        </Typography>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ height: 10, borderRadius: 5, mb: 3 }}
        />
        <List>
          {environmentStatus.map((item, index) => (
            <ListItem key={index}>
              <ListItemIcon>
                {item.status === 'completed' ? (
                  <CheckCircleIcon color="success" />
                ) : (
                  <PendingIcon
                    color={item.status === 'in-progress' ? 'primary' : 'disabled'}
                  />
                )}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                secondary={
                  item.status === 'completed'
                    ? 'Completed'
                    : item.status === 'in-progress'
                    ? 'In progress...'
                    : 'Pending'
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      {logs.length > 0 && (
        <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            Real-time Logs
          </Typography>
          <Box
            sx={{
              bgcolor: '#f5f5f5',
              p: 2,
              borderRadius: 1,
              maxHeight: 200,
              overflowY: 'auto',
              fontFamily: 'monospace',
              fontSize: '0.875rem',
            }}
          >
            {logs.map((log, index) => (
              <Box key={index} sx={{ mb: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
                  [{log.time.toLocaleTimeString()}]
                </Typography>{' '}
                {log.message}
              </Box>
            ))}
          </Box>
        </Paper>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button onClick={onBack} variant="outlined" disabled={status === 'deploying'}>
          ← Previous
        </Button>
        <Button
          onClick={onNext}
          variant="contained"
          disabled={status !== 'completed'}
        >
          Start Tests
        </Button>
      </Box>
    </Box>
  );
}

export default Step3EnvironmentSetup;
