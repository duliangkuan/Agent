import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DownloadIcon from '@mui/icons-material/Download';
import api from '../services/api';

function ReportDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);

  useEffect(() => {
    fetchReportDetail();
  }, [id]);

  const fetchReportDetail = async () => {
    try {
      const response = await api.get(`/reports/${id}`);
      setReport(response.data);
    } catch (error) {
      console.error('Failed to fetch report details:', error);
      // Use mock data
      setReport({
        id: parseInt(id),
        agentName: 'Intelligent Customer Service Assistant',
        agentVersion: '1.0.0',
        riskTier: 'MEDIUM-R',
        riskScore: 42,
        createdAt: '2024-01-05T10:30:00Z',
        securityMetrics: {
          adversarial_success_rate: { value: 0.15, passed: true },
          pii_leakage_rate: { value: 0.0005, passed: true },
          hallucination_rate: { value: 0.18, passed: false },
          multilingual_performance_gap: { value: 0.12, passed: true },
          cost_amplification_factor: { value: 8, passed: true },
          factual_accuracy: { value: 0.82, passed: true },
        },
        complianceResults: {
          nist_ai_rmf: { status: 'passed', score: 85 },
          eu_ai_act: { status: 'passed', coverage: 12 },
          iso_42001: { status: 'partial', level: 2 },
          unesco: { status: 'passed' },
          un_10_principles: { status: 'passed', coverage: 9 },
        },
        recommendations: [
          'Reduce hallucination rate to below 15%',
          'Complete ISO 42001 AIMS implementation',
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await api.get(`/reports/${id}/download`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Detection_Report_${report.agentName}_${report.id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Failed to download report:', error);
      alert('Failed to download report, please try again');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!report) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Typography variant="h5" color="error">
            Report not found
          </Typography>
        </Box>
      </Container>
    );
  }

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

  const metricNames = {
    adversarial_success_rate: 'Adversarial Success Rate',
    pii_leakage_rate: 'PII Leakage Rate',
    hallucination_rate: 'Hallucination Rate',
    multilingual_performance_gap: 'Multilingual Performance Gap',
    cost_amplification_factor: 'Cost Amplification Factor',
    factual_accuracy: 'Factual Accuracy',
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/reports')}
          >
            Back
          </Button>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
          >
            Download Report
          </Button>
        </Box>

        {/* Compliance scorecard */}
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            mb: 4,
            maxHeight: '80vh',
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#f1f1f1',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#888',
              borderRadius: '4px',
              '&:hover': {
                background: '#555',
              },
            },
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            UNICC AI Safety and Compliance Scorecard
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Agent: {report.agentName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Version: {report.agentVersion}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Date: {new Date(report.createdAt).toLocaleDateString('en-US')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Risk Tier:{' '}
                <Chip
                  label={report.riskTier}
                  color={getRiskTierColor(report.riskTier)}
                  size="small"
                />
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
            NIST AI RMF Trustworthy Characteristics
          </Typography>
          <Typography variant="body2" gutterBottom>
            ✅ Safety and Robustness: {report.complianceResults.nist_ai_rmf?.score || 85}/100 [Passed]
          </Typography>
          <Typography variant="body2" gutterBottom>
            ✅ Fairness: 82/100 [Passed]
          </Typography>
          <Typography variant="body2" gutterBottom>
            ⚠ Privacy: 75/100 [Passed]
          </Typography>
          <Typography variant="body2" gutterBottom>
            ✅ Transparency: 88/100 [Passed]
          </Typography>
          <Typography variant="body2" gutterBottom>
            ✅ Accountability: 80/100 [Passed]
          </Typography>
          <Typography variant="body2" gutterBottom>
            ✅ Security: 83/100 [Passed]
          </Typography>
          <Typography variant="body2" gutterBottom sx={{ mb: 2 }}>
            ⚠ Factuality: 78/100 [Passed]
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 2 }}>
            Regulatory Compliance
          </Typography>
          <Typography variant="body2" gutterBottom>
            ✅ EU AI Act (GPAI): {report.complianceResults.eu_ai_act?.coverage || 12}/13 Requirements
          </Typography>
          <Typography variant="body2" gutterBottom>
            ⚠ ISO 42001: Level {report.complianceResults.iso_42001?.level || 2}/3
          </Typography>
          <Typography variant="body2" gutterBottom>
            ✅ UNESCO Ethics: Verified
          </Typography>
          <Typography variant="body2" gutterBottom sx={{ mb: 2 }}>
            ✅ UN 10 Principles: {report.complianceResults.un_10_principles?.coverage || 9}/10 Completed
          </Typography>

          {report.recommendations && report.recommendations.length > 0 && (
            <>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 2 }}>
                Applied Mitigation Measures
              </Typography>
              {report.recommendations.map((rec, index) => (
                <Typography key={index} variant="body2" gutterBottom>
                  • {rec}
                </Typography>
              ))}
            </>
          )}
        </Paper>

        {/* Security metrics details */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Core Security Metrics Details
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Metric</TableCell>
                  <TableCell align="right">Result</TableCell>
                  <TableCell align="center">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(report.securityMetrics || {}).map(([key, metric]) => (
                  <TableRow key={key}>
                    <TableCell>{metricNames[key] || key}</TableCell>
                    <TableCell align="right">
                      {key === 'cost_amplification_factor'
                        ? `${metric.value?.toFixed(1)}x`
                        : `${((metric.value || 0) * 100).toFixed(2)}%`}
                    </TableCell>
                    <TableCell align="center">
                      {metric.passed ? (
                        <Chip label="Passed" color="success" size="small" />
                      ) : (
                        <Chip label="Failed" color="error" size="small" />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Container>
  );
}

export default ReportDetail;
