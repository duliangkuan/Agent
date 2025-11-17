import React, { useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import { useDetectionFlow } from '../../contexts/DetectionFlowContext';

function Step5ResultsSummary({ onNext, onBack }) {
  const { flowData, setFlowData } = useDetectionFlow();
  const { testResults, riskScore, riskTier } = flowData;

  useEffect(() => {
    // If risk score not calculated yet, calculate from test results
    if (testResults && !riskScore) {
      calculateRiskScore();
    }
  }, [testResults, riskScore]);

  const calculateRiskScore = () => {
    // Should call backend API to calculate risk score
    // Using mock data for now
    const mockRiskScore = 42;
    const mockRiskTier = mockRiskScore >= 70 ? 'HIGH-R' : mockRiskScore >= 40 ? 'MEDIUM-R' : 'LOW-R';
    
    setFlowData((prev) => ({
      ...prev,
      riskScore: mockRiskScore,
      riskTier: mockRiskTier,
    }));
  };

  const getRiskTierColor = (tier) => {
    switch (tier) {
      case 'HIGH-R':
        return 'error';
      case 'MEDIUM-R':
        return 'warning';
      case 'LOW-R':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (passed) => {
    if (passed === undefined) return null;
    return passed ? (
      <CheckCircleIcon color="success" fontSize="small" />
    ) : (
      <ErrorIcon color="error" fontSize="small" />
    );
  };

  const securityMetrics = testResults?.security || {
    adversarial_success_rate: { value: 0.15, passed: true },
    pii_leakage_rate: { value: 0.0005, passed: true },
    hallucination_rate: { value: 0.18, passed: false },
    multilingual_performance_gap: { value: 0.12, passed: true },
    cost_amplification_factor: { value: 8, passed: true },
    factual_accuracy: { value: 0.82, passed: true },
  };

  const complianceResults = testResults?.compliance || {
    nist_ai_rmf: { status: 'passed', score: 85 },
    eu_ai_act: { status: 'passed', coverage: 12 },
    iso_42001: { status: 'partial', level: 2 },
    unesco: { status: 'passed' },
    un_10_principles: { status: 'passed', coverage: 9 },
  };

  const metricNames = {
    adversarial_success_rate: 'Adversarial Success Rate',
    pii_leakage_rate: 'PII Leakage Rate',
    hallucination_rate: 'Hallucination Rate',
    multilingual_performance_gap: 'Multilingual Performance Gap',
    cost_amplification_factor: 'Cost Amplification Factor',
    factual_accuracy: 'Factual Accuracy',
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Step 5/6: Results Summary
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Tests completed. Below are the detection results for each metric and risk score.
      </Typography>

      {/* Risk score card */}
      <Paper elevation={3} sx={{ p: 3, mb: 4, bgcolor: 'primary.main', color: 'white' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Risk Score
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
              {riskScore || 42}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Risk Tier
            </Typography>
            <Chip
              label={riskTier || 'MEDIUM-R'}
              color={getRiskTierColor(riskTier || 'MEDIUM-R')}
              sx={{ fontSize: '1.2rem', height: 40, bgcolor: 'white' }}
            />
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        {/* Security metrics */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              Core Security Metrics
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Metric</TableCell>
                    <TableCell align="right">Result</TableCell>
                    <TableCell align="center">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(securityMetrics).map(([key, metric]) => (
                    <TableRow key={key}>
                      <TableCell>{metricNames[key] || key}</TableCell>
                      <TableCell align="right">
                        {key === 'cost_amplification_factor'
                          ? `${metric.value?.toFixed(1)}x`
                          : key === 'factual_accuracy'
                          ? `${((metric.value || 0) * 100).toFixed(2)}%`
                          : `${((metric.value || 0) * 100).toFixed(2)}%`}
                      </TableCell>
                      <TableCell align="center">
                        {getStatusIcon(metric.passed)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Compliance checks */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              Compliance Check Status
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Check Item</TableCell>
                    <TableCell align="right">Details</TableCell>
                    <TableCell align="center">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>NIST AI RMF</TableCell>
                    <TableCell align="right">Score: {complianceResults.nist_ai_rmf?.score || 85}/100</TableCell>
                    <TableCell align="center">
                      <CheckCircleIcon color="success" fontSize="small" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>EU AI Act</TableCell>
                    <TableCell align="right">{complianceResults.eu_ai_act?.coverage || 12}/13</TableCell>
                    <TableCell align="center">
                      <CheckCircleIcon color="success" fontSize="small" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>ISO 42001</TableCell>
                    <TableCell align="right">Level {complianceResults.iso_42001?.level || 2}/3</TableCell>
                    <TableCell align="center">
                      <WarningIcon color="warning" fontSize="small" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>UNESCO Ethics</TableCell>
                    <TableCell align="right">Verified</TableCell>
                    <TableCell align="center">
                      <CheckCircleIcon color="success" fontSize="small" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>UN 10 Principles</TableCell>
                    <TableCell align="right">{complianceResults.un_10_principles?.coverage || 9}/10</TableCell>
                    <TableCell align="center">
                      <CheckCircleIcon color="success" fontSize="small" />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button onClick={onBack} variant="outlined">
          ← Previous
        </Button>
        <Button onClick={onNext} variant="contained">
          Generate Report →
        </Button>
      </Box>
    </Box>
  );
}

export default Step5ResultsSummary;
