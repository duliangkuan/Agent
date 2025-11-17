# Frontend Application

React-based frontend for the UNICC AI Agent Safety and Compliance Detection Platform.

## Quick Start

### Prerequisites
- Node.js >= 18
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm start
```

The application will start on http://localhost:3000

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` directory.

## Project Structure

```
frontend/
├── public/
│   └── index.html          # HTML template
├── src/
│   ├── components/         # Reusable React components
│   │   ├── DetectionFlow/  # Detection wizard components
│   │   └── Layout/         # Layout components
│   ├── contexts/           # React contexts for state management
│   ├── pages/              # Page components
│   │   ├── Home.js         # Landing page
│   │   ├── Dashboard.js    # Dashboard page
│   │   ├── DetectionFlow.js # Detection wizard
│   │   ├── Reports.js       # Reports list
│   │   ├── ReportDetail.js # Report details
│   │   └── Settings.js      # Settings page
│   ├── services/           # API service layer
│   │   └── api.js          # API client
│   ├── App.js              # Main app component
│   ├── index.js            # Entry point
│   └── index.css           # Global styles
└── package.json
```

## Features

- **Flow-based Detection Wizard**: 6-step guided process for security testing
- **Real-time Progress**: WebSocket-based real-time test progress updates
- **Dashboard**: Comprehensive overview of detection results and statistics
- **Report Management**: View, download, and manage security reports
- **Responsive Design**: Material-UI based responsive interface

## Tech Stack

- **React 18** - UI library
- **Material-UI (MUI)** - Component library
- **React Router** - Routing
- **Axios** - HTTP client
- **Socket.io Client** - WebSocket communication
- **React Hook Form** - Form management
- **Recharts** - Chart visualization

## Environment Variables

The frontend uses a proxy to the backend API (configured in `package.json`):
- Development: `http://localhost:8000`
- Production: Set `REACT_APP_API_URL` environment variable

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App (irreversible)

## Component Architecture

### Detection Flow Components

The detection wizard consists of 6 steps:
1. **Step1AgentConfig** - Agent configuration
2. **Step2CCLSelection** - Compliance check list selection
3. **Step3EnvironmentSetup** - Environment setup
4. **Step4TestExecution** - Test execution with real-time progress
5. **Step5ResultsSummary** - Results summary
6. **Step6ReportPreview** - Report preview

### State Management

- **DetectionFlowContext**: Manages detection flow state across wizard steps
- Uses React Context API for global state
- Local component state for UI-specific state

## API Integration

All API calls are centralized in `src/services/api.js`:
- Dashboard statistics
- Detection test execution
- Report management
- Real-time updates via WebSocket

## Styling

- Material-UI theme customization
- Responsive design with MUI breakpoints
- Custom CSS in `index.css` for global styles

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

