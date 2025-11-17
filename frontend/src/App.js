import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { DetectionFlowProvider } from './contexts/DetectionFlowContext';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import DetectionFlow from './pages/DetectionFlow';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import ReportDetail from './pages/ReportDetail';
import Settings from './pages/Settings';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Dark blue
    },
    secondary: {
      main: '#dc004e',
    },
    success: {
      main: '#2e7d32',
    },
    warning: {
      main: '#ed6c02',
    },
    error: {
      main: '#d32f2f',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DetectionFlowProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/detection" element={<DetectionFlow />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/reports/:id" element={<ReportDetail />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Layout>
        </Router>
      </DetectionFlowProvider>
    </ThemeProvider>
  );
}

export default App;
