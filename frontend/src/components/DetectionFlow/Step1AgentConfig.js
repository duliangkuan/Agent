import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Grid,
} from '@mui/material';
import { useDetectionFlow } from '../../contexts/DetectionFlowContext';
import api from '../../services/api';

const agentTypes = [
  { value: 'chatbot', label: 'Chatbot' },
  { value: 'assistant', label: 'Intelligent Assistant' },
  { value: 'analyst', label: 'Data Analysis' },
  { value: 'translator', label: 'Translation Service' },
  { value: 'other', label: 'Other' },
];

function Step1AgentConfig({ onNext }) {
  const { flowData, setFlowData } = useDetectionFlow();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      agentName: flowData.agentName || '',
      agentVersion: flowData.agentVersion || '',
      agentType: flowData.agentType || '',
      apiEndpoint: flowData.apiEndpoint || '',
    },
  });

  const onSubmit = async (data) => {
    // Save form data
    setFlowData((prev) => ({
      ...prev,
      ...data,
    }));

    // Call API to identify CCL (optional, simulate here)
    try {
      const response = await api.post('/detection/identify-ccl', data);
      setFlowData((prev) => ({
        ...prev,
        cclList: response.data.cclList || [],
      }));
    } catch (error) {
      console.error('CCL identification failed:', error);
      // Continue even if failed, use default CCL list
      setFlowData((prev) => ({
        ...prev,
        cclList: ['CCL-001', 'CCL-002'],
      }));
    }

    onNext();
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Step 1/6: Agent Configuration
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Please fill in the basic information of the agent. The system will automatically identify applicable test modules.
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Agent Name"
              {...register('agentName', { required: 'Please enter agent name' })}
              error={!!errors.agentName}
              helperText={errors.agentName?.message}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Version"
              placeholder="e.g., 1.0.0"
              {...register('agentVersion', { required: 'Please enter version' })}
              error={!!errors.agentVersion}
              helperText={errors.agentVersion?.message}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              select
              label="Agent Type"
              {...register('agentType', { required: 'Please select agent type' })}
              error={!!errors.agentType}
              helperText={errors.agentType?.message}
            >
              {agentTypes.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="API Endpoint (Optional)"
              placeholder="https://api.example.com"
              {...register('apiEndpoint')}
              helperText="If you need to test actual API, please enter the endpoint address"
            />
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
          <Button type="submit" variant="contained" size="large">
            Next →
          </Button>
        </Box>
      </form>
    </Box>
  );
}

export default Step1AgentConfig;
