import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Paper,
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import AssessmentIcon from '@mui/icons-material/Assessment';
import DescriptionIcon from '@mui/icons-material/Description';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

function Home() {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Workflow-based Detection',
      description: '6-step wizard detection process, clear and intuitive',
      icon: <SecurityIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
    },
    {
      title: '6 Core Metrics',
      description: 'Comprehensive evaluation including adversarial success rate, PII leakage rate, hallucination rate, etc.',
      icon: <AssessmentIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
    },
    {
      title: 'Compliance Checks',
      description: '5 compliance standards: NIST AI RMF, EU AI Act, ISO 42001, etc.',
      icon: <DescriptionIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
    },
    {
      title: 'Risk Rating',
      description: 'Automatically calculate risk scores and generate deployment decision recommendations',
      icon: <TrendingUpIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Welcome section */}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            mb: 4,
            background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
            color: 'white',
          }}
        >
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
            Welcome to UNICC AI Safety and Compliance Detection Platform
          </Typography>
          <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
            Automated Agent Security Detection and Compliance Assessment
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/detection')}
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.9)',
              },
            }}
          >
            Start Detection
          </Button>
        </Paper>

        {/* Features */}
        <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
          Core Features
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  textAlign: 'center',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h6" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Quick actions */}
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
            Quick Actions
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              onClick={() => navigate('/detection')}
            >
              New Detection
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/reports')}
            >
              View Reports
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/dashboard')}
            >
              Dashboard
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default Home;
