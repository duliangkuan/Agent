import React, { useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  FormControlLabel,
  Paper,
  Chip,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SecurityIcon from '@mui/icons-material/Security';
import { useDetectionFlow } from '../../contexts/DetectionFlowContext';

const testModules = [
  { id: 'security', label: 'Security Test Layer (Complete)', required: true },
  { id: 'compliance', label: 'Compliance Check Layer (Complete)', required: true },
];

function Step2CCLSelection({ onNext, onBack }) {
  const { flowData, setFlowData } = useDetectionFlow();

  useEffect(() => {
    // If no CCL list yet, use default values
    if (!flowData.cclList || flowData.cclList.length === 0) {
      setFlowData((prev) => ({
        ...prev,
        cclList: ['CCL-001: Data Processing', 'CCL-002: User Interaction'],
      }));
    }
  }, [flowData.cclList, setFlowData]);

  const handleModuleToggle = (moduleId) => {
    setFlowData((prev) => {
      const selected = prev.selectedModules || [];
      const index = selected.indexOf(moduleId);
      const newSelected =
        index === -1
          ? [...selected, moduleId]
          : selected.filter((id) => id !== moduleId);
      return { ...prev, selectedModules: newSelected };
    });
  };

  const handleNext = () => {
    // Ensure at least required modules are selected
    const selected = flowData.selectedModules || [];
    if (selected.length === 0) {
      setFlowData((prev) => ({
        ...prev,
        selectedModules: ['security', 'compliance'],
      }));
    }
    onNext();
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Step 2/6: CCL Identification & Module Selection
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        The system has identified the following Critical Capability Levels (CCL) based on agent configuration. Please confirm test module selection.
      </Typography>

      <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Detected CCLs
        </Typography>
        <List>
          {flowData.cclList.map((ccl, index) => (
            <ListItem key={index}>
              <ListItemIcon>
                <CheckCircleIcon color="success" />
              </ListItemIcon>
              <ListItemText primary={ccl} />
            </ListItem>
          ))}
        </List>
      </Paper>

      <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
          Recommended Test Modules
        </Typography>
        {testModules.map((module) => (
          <FormControlLabel
            key={module.id}
            control={
              <Checkbox
                checked={
                  (flowData.selectedModules || []).includes(module.id) ||
                  module.required
                }
                disabled={module.required}
                onChange={() => handleModuleToggle(module.id)}
                icon={<SecurityIcon />}
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography>{module.label}</Typography>
                {module.required && (
                  <Chip label="Required" size="small" color="primary" />
                )}
              </Box>
            }
            sx={{ display: 'block', mb: 1 }}
          />
        ))}
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button onClick={onBack} variant="outlined">
          ← Previous
        </Button>
        <Button onClick={handleNext} variant="contained">
          Next →
        </Button>
      </Box>
    </Box>
  );
}

export default Step2CCLSelection;
