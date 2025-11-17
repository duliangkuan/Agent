import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Grid,
  TextField,
  Button,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { useState } from 'react';

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function Settings() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
          Settings
        </Typography>

        <Paper elevation={2}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Test Configuration" />
            <Tab label="Threshold Settings" />
            <Tab label="Account Management" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              Test Configuration
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Default API Endpoint"
                  placeholder="https://api.example.com"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Timeout (seconds)"
                  type="number"
                  defaultValue={300}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Auto-save test results"
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained">Save Configuration</Button>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              Risk Threshold Settings
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>
                  LOW-R Threshold
                </Typography>
                <TextField
                  fullWidth
                  label="Maximum Risk Score"
                  type="number"
                  defaultValue={40}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>
                  MEDIUM-R Threshold
                </Typography>
                <TextField
                  fullWidth
                  label="Maximum Risk Score"
                  type="number"
                  defaultValue={70}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained">Save Thresholds</Button>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              Account Management
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Username"
                  defaultValue="admin"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  defaultValue="admin@example.com"
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" color="error">
                  Change Password
                </Button>
              </Grid>
            </Grid>
          </TabPanel>
        </Paper>
      </Box>
    </Container>
  );
}

export default Settings;
