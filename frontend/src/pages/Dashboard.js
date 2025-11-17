import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import api from '../services/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDetections: 0,
    riskDistribution: [],
    recentTrends: [],
    complianceStatus: [],
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/dashboard/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // Use mock data
      setStats({
        totalDetections: 156,
        riskDistribution: [
          { name: 'LOW-R', value: 89 },
          { name: 'MEDIUM-R', value: 54 },
          { name: 'HIGH-R', value: 13 },
        ],
        recentTrends: [
          { date: '2024-01-01', avgScore: 38, total: 12 },
          { date: '2024-01-02', avgScore: 42, total: 15 },
          { date: '2024-01-03', avgScore: 35, total: 18 },
          { date: '2024-01-04', avgScore: 45, total: 14 },
          { date: '2024-01-05', avgScore: 40, total: 16 },
        ],
        complianceStatus: [
          { name: 'NIST AI RMF', passed: 142, failed: 14 },
          { name: 'EU AI Act', passed: 138, failed: 18 },
          { name: 'ISO 42001', passed: 89, failed: 67 },
          { name: 'UNESCO', passed: 150, failed: 6 },
          { name: 'UN 10 Principles', passed: 145, failed: 11 },
        ],
      });
    } finally {
      setLoading(false);
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
        <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
          Dashboard
        </Typography>

        {/* Overview cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Total Detections
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 600 }}>
                  {stats.totalDetections}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  LOW-R Detections
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 600, color: 'success.main' }}>
                  {stats.riskDistribution.find((r) => r.name === 'LOW-R')?.value || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  MEDIUM-R Detections
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 600, color: 'warning.main' }}>
                  {stats.riskDistribution.find((r) => r.name === 'MEDIUM-R')?.value || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  HIGH-R Detections
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 600, color: 'error.main' }}>
                  {stats.riskDistribution.find((r) => r.name === 'HIGH-R')?.value || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Risk tier distribution */}
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Risk Tier Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats.riskDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stats.riskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Recent trends */}
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Recent Trends (Risk Score)
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stats.recentTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="avgScore"
                    stroke="#8884d8"
                    name="Average Risk Score"
                  />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#82ca9d"
                    name="Detection Count"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Compliance status overview */}
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Compliance Status Overview
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.complianceStatus}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="passed" fill="#82ca9d" name="Passed" />
                  <Bar dataKey="failed" fill="#ff8042" name="Failed" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default Dashboard;
