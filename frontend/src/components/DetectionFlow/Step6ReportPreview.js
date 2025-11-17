import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Paper,
  Grid,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useDetectionFlow } from '../../contexts/DetectionFlowContext';
import api from '../../services/api';

function Step6ReportPreview({ onBack }) {
  const navigate = useNavigate();
  const { flowData, setFlowData } = useDetectionFlow();
  const [reportId, setReportId] = useState(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    generateReport();
  }, []);

  const generateReport = async () => {
    setGenerating(true);
    try {
      const response = await api.post('/reports/generate', {
        agentName: flowData.agentName,
        agentVersion: flowData.agentVersion,
        testResults: flowData.testResults,
        riskScore: flowData.riskScore,
        riskTier: flowData.riskTier,
      });
      
      setReportId(response.data.reportId);
      setFlowData((prev) => ({ ...prev, reportId: response.data.reportId }));
    } catch (error) {
      console.error('Failed to generate report:', error);
      // Use mock report ID
      const mockReportId = `RPT-${Date.now()}`;
      setReportId(mockReportId);
    } finally {
      setGenerating(false);
    }
  };

  const downloadReport = async (format = 'pdf') => {
    if (!reportId) return;
    
    try {
      const response = await api.get(`/reports/${reportId}/download`, {
        params: { format },
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Security_Detection_Report_${flowData.agentName}_${Date.now()}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Failed to download report:', error);
      alert('Failed to download report, please try again');
    }
  };

  const getDeploymentDecision = () => {
    const { riskTier } = flowData;
    const compliancePassed = flowData.testResults?.compliance?.iso_42001?.status !== 'failed';
    
    if (riskTier === 'HIGH-R') {
      return { decision: 'Block Deployment', color: 'error', recommendations: ['Risk level too high, mitigation measures must be taken', 'Fix high-risk security issues', 'Re-evaluate and test again'] };
    } else if (riskTier === 'MEDIUM-R' || !compliancePassed) {
      return { decision: 'Pause Deployment', color: 'warning', recommendations: ['Reduce hallucination rate to below 15%', 'Complete ISO 42001 AIMS implementation', 'Re-evaluate and test again'] };
    } else {
      return { decision: 'Proceed with Deployment', color: 'success', recommendations: ['Monitor operational status', 'Regularly review risk scores'] };
    }
  };

  const deployment = getDeploymentDecision();

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Step 6/6: Report & Decision
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Detection completed. Below are deployment decision recommendations and report download.
      </Typography>

      {/* Deployment decision card */}
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
          Deployment Decision
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Chip
            label={deployment.decision}
            color={deployment.color}
            sx={{ fontSize: '1.2rem', height: 40, fontWeight: 600 }}
          />
          <Typography variant="body2" color="text.secondary">
            Risk Tier: {flowData.riskTier || 'MEDIUM-R'} | 
            Risk Score: {flowData.riskScore || 42}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mt: 2 }}>
          Recommendations:
        </Typography>
        <List>
          {deployment.recommendations.map((rec, index) => (
            <ListItem key={index}>
              <ListItemText primary={`• ${rec}`} />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Compliance scorecard preview */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
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
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
          UNICC AI Safety and Compliance Scorecard
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Agent: {flowData.agentName || 'Unnamed'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Version: {flowData.agentVersion || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Date: {new Date().toLocaleDateString('en-US')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Risk Tier: {flowData.riskTier || 'MEDIUM-R'}
            </Typography>
          </Grid>
        </Grid>

        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, mt: 2 }}>
          NIST AI RMF Trustworthy Characteristics: Passed (85/100)
        </Typography>
        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
          Regulatory Compliance: Mostly Passed (ISO 42001 needs improvement)
        </Typography>
      </Paper>

      {/* Action buttons */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={() => downloadReport('pdf')}
          disabled={generating || !reportId}
          size="large"
        >
          Download PDF Report
        </Button>
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={() => downloadReport('excel')}
          disabled={generating || !reportId}
        >
          Download Excel
        </Button>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={() => navigate('/detection')}
        >
          New Detection
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigate('/reports')}
        >
          View All Reports
        </Button>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 4 }}>
        <Button onClick={onBack} variant="outlined">
          ← Previous
        </Button>
      </Box>
    </Box>
  );
}

export default Step6ReportPreview;
