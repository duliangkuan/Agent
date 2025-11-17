import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Button,
  Typography,
} from '@mui/material';
import Step1AgentConfig from '../components/DetectionFlow/Step1AgentConfig';
import Step2CCLSelection from '../components/DetectionFlow/Step2CCLSelection';
import Step3EnvironmentSetup from '../components/DetectionFlow/Step3EnvironmentSetup';
import Step4TestExecution from '../components/DetectionFlow/Step4TestExecution';
import Step5ResultsSummary from '../components/DetectionFlow/Step5ResultsSummary';
import Step6ReportPreview from '../components/DetectionFlow/Step6ReportPreview';
import { useDetectionFlow } from '../contexts/DetectionFlowContext';
import io from 'socket.io-client';

const steps = [
  'Agent Configuration',
  'CCL Identification & Module Selection',
  'Environment Setup',
  'Test Execution',
  'Results Summary',
  'Report & Decision',
];

function DetectionFlow() {
  const navigate = useNavigate();
  const { flowData, setFlowData } = useDetectionFlow();
  const [activeStep, setActiveStep] = useState(0);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initialize WebSocket connection
    // Use REACT_APP_API_URL without /api suffix, or default to localhost
    const apiUrl = process.env.REACT_APP_API_URL 
      ? process.env.REACT_APP_API_URL.replace('/api', '')
      : 'http://localhost:8000';
    const newSocket = io(apiUrl);
    setSocket(newSocket);

    // Listen for test progress updates
    newSocket.on('test-progress', (data) => {
      if (data.jobId === flowData.jobId) {
        setFlowData((prev) => ({
          ...prev,
          testProgress: data.progress,
          testResults: data.results || prev.testResults,
        }));
        // If test completed, automatically proceed to next step
        if (data.status === 'completed' && activeStep === 3) {
          setTimeout(() => setActiveStep(4), 1000);
        }
      }
    });

    return () => {
      newSocket.close();
    };
  }, [flowData.jobId, activeStep, setFlowData]);

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      // Last step, complete detection
      navigate('/reports');
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return <Step1AgentConfig onNext={handleNext} />;
      case 1:
        return <Step2CCLSelection onNext={handleNext} onBack={handleBack} />;
      case 2:
        return <Step3EnvironmentSetup onNext={handleNext} onBack={handleBack} />;
      case 3:
        return <Step4TestExecution onNext={handleNext} onBack={handleBack} socket={socket} />;
      case 4:
        return <Step5ResultsSummary onNext={handleNext} onBack={handleBack} />;
      case 5:
        return <Step6ReportPreview onBack={handleBack} />;
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
          Agent Security Detection Flow
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Paper elevation={3} sx={{ p: 4, minHeight: '500px' }}>
          {renderStepContent()}
        </Paper>
      </Box>
    </Container>
  );
}

export default DetectionFlow;
