# UNICC AI Agent Safety and Compliance Detection Platform

Automated AI Agent Security Detection and Compliance Assessment Platform

## Project Structure

```
Agent/
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   └── services/      # API services
│   └── public/            # Static assets
├── backend/           # Node.js backend API
│   ├── src/
│   │   ├── db/            # Database configuration and migrations
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic services
│   │   └── server.js      # Server entry point
│   └── data/              # SQLite database files
├── README.md          # Project documentation
├── CONTRIBUTING.md    # Contribution guidelines
└── LICENSE            # MIT License
```

## Tech Stack

### Frontend
- React 18
- Material-UI (MUI)
- React Router
- Axios
- Recharts (charts)
- React Hook Form

### Backend
- Node.js + Express
- SQLite (default) / PostgreSQL
- Socket.io (WebSocket)
- PDFKit (report generation)

## Quick Start

### Requirements
- Node.js >= 18
- SQLite (included) or PostgreSQL >= 14 (optional)

### Install Dependencies

```bash
# Frontend
cd frontend
npm install

# Backend
cd backend
npm install
```

### Configure Environment Variables

**Step 1: Configure Database**

Copy `backend/env.example` to `backend/.env`:

```bash
# Windows
cd backend
copy env.example .env

# Mac/Linux
cd backend
cp env.example .env
```

Edit `backend/.env` file:

```env
# Use SQLite (recommended, no setup required)
DB_TYPE=sqlite
DB_PATH=./data/agent_security.db

# Or use PostgreSQL
# DATABASE_URL=postgresql://postgres:your_password@localhost:5432/agent_security
```

**Important:** If using PostgreSQL, replace `your_password` with your PostgreSQL password!

### Initialize Database

```bash
cd backend
npm run db:init
```

This will automatically:
- Test database connection
- Create all required tables
- Populate sample data

### Start Services

```bash
# Start backend (Terminal 1)
cd backend
npm run dev

# Start frontend (Terminal 2)
cd frontend
npm start
```

Visit http://localhost:3000

## Features

- ✅ Flow-based detection wizard (6 steps)
- ✅ Real-time test progress display
- ✅ 6 core security metrics testing
- ✅ 5 compliance check modules
- ✅ Risk scoring and tier assessment
- ✅ Compliance scorecard generation
- ✅ PDF/Excel report export
- ✅ Historical report viewing

## Development

For detailed development documentation:
- [Backend Documentation](./backend/README.md) - Backend API and setup guide
- [Frontend Documentation](./frontend/README.md) - Frontend application guide

## Additional Resources

- [SQLite Compatibility Fixes](./backend/SQLite-Compatibility-Fixes.md) - Database migration guide
- [Backend Documentation](./backend/README.md) - Backend API and setup guide
- [Contributing Guide](./CONTRIBUTING.md) - How to contribute to this project

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Deployment

### Quick Deploy

- **[Quick Start Guide](./QUICK_START_DEPLOY.md)** - Get deployed in 15 minutes
- **[Full Deployment Guide](./DEPLOYMENT.md)** - Comprehensive deployment instructions
- **[GitHub Upload Guide](./deploy-to-github.md)** - Step-by-step GitHub setup

### Recommended Architecture

- **Frontend**: Deploy to [Vercel](https://vercel.com)
- **Backend**: Deploy to [Railway](https://railway.app) or [Render](https://render.com)
- **Database**: SQLite (included) or PostgreSQL (for production)

## Support

For issues, questions, or contributions, please refer to the [Contributing Guide](./CONTRIBUTING.md) or open an issue in the repository.
