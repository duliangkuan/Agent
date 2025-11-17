import React, { createContext, useContext, useState } from 'react';

const DetectionFlowContext = createContext();

export function DetectionFlowProvider({ children }) {
  const [flowData, setFlowData] = useState({
    // Step 1 data
    agentName: '',
    agentVersion: '',
    agentType: '',
    apiEndpoint: '',
    
    // Step 2 data
    cclList: [],
    selectedModules: [],
    
    // Step 3 data
    environmentStatus: 'pending',
    
    // Step 4 data
    jobId: null,
    testProgress: {},
    testResults: null,
    
    // Step 5 data
    riskScore: null,
    riskTier: null,
    
    // Step 6 data
    reportId: null,
  });

  return (
    <DetectionFlowContext.Provider value={{ flowData, setFlowData }}>
      {children}
    </DetectionFlowContext.Provider>
  );
}

export function useDetectionFlow() {
  const context = useContext(DetectionFlowContext);
  if (!context) {
    throw new Error('useDetectionFlow must be used within DetectionFlowProvider');
  }
  return context;
}
