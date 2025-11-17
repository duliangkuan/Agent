import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  IconButton,
  CircularProgress,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import api from '../services/api';

function Reports() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await api.get('/reports');
      setReports(response.data);
    } catch (error) {
      console.error('Failed to fetch report list:', error);
      // Use mock data
      setReports([
        {
          id: 1,
          agentName: 'Intelligent Customer Service Assistant',
          agentVersion: '1.0.0',
          riskTier: 'MEDIUM-R',
          riskScore: 42,
          createdAt: '2024-01-05T10:30:00Z',
          status: 'completed',
        },
        {
          id: 2,
          agentName: 'Data Analysis Agent',
          agentVersion: '2.1.0',
          riskTier: 'LOW-R',
          riskScore: 25,
          createdAt: '2024-01-04T14:20:00Z',
          status: 'completed',
        },
        {
          id: 3,
          agentName: 'Translation Service',
          agentVersion: '1.5.2',
          riskTier: 'HIGH-R',
          riskScore: 75,
          createdAt: '2024-01-03T09:15:00Z',
          status: 'completed',
        },
      ]);
    } finally {
      setLoading(false);
    }
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

  const handleDownload = async (reportId, e) => {
    e.stopPropagation();
    try {
      const response = await api.get(`/reports/${reportId}/download`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Detection_Report_${reportId}.pdf`);
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

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Reports Center
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/detection')}
          >
            New Detection
          </Button>
        </Box>

        <Paper elevation={2}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Agent Name</TableCell>
                  <TableCell>Version</TableCell>
                  <TableCell align="center">Risk Tier</TableCell>
                  <TableCell align="center">Risk Score</TableCell>
                  <TableCell>Detection Time</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography color="text.secondary" sx={{ py: 4 }}>
                        No reports available, please create a new detection
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  reports.map((report) => (
                    <TableRow
                      key={report.id}
                      hover
                      sx={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/reports/${report.id}`)}
                    >
                      <TableCell>{report.agentName}</TableCell>
                      <TableCell>{report.agentVersion}</TableCell>
                      <TableCell align="center">
                        <Chip
                          label={report.riskTier}
                          color={getRiskTierColor(report.riskTier)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">{report.riskScore}</TableCell>
                      <TableCell>
                        {new Date(report.createdAt).toLocaleString('en-US')}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/reports/${report.id}`);
                          }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={(e) => handleDownload(report.id, e)}
                        >
                          <DownloadIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Container>
  );
}

export default Reports;
