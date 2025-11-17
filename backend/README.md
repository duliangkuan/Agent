# Backend Service

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `env.example` to `.env`:

```bash
cp env.example .env
```

Edit `.env` file to configure database:

```env
# Use SQLite database (recommended)
DB_TYPE=sqlite
DB_PATH=./data/agent_security.db

# Or use PostgreSQL
# DATABASE_URL=postgresql://postgres:password@localhost:5432/agent_security
```

### 3. Initialize Database

```bash
npm run db:init
```

### 4. Start Server

```bash
# Development mode (auto-restart)
npm run dev

# Production mode
npm start
```

## Database Management

```bash
# Initialize database (create tables + populate sample data)
npm run db:init

# Create tables only
npm run db:migrate

# Populate sample data only
npm run db:seed

# Reset database (drop all tables)
npm run db:reset

# Recreate database (drop and rebuild)
npm run db:recreate
```

## Utility Scripts

```bash
# Check server status
node check-server.js

# Recreate database
node recreate-database.js
```

## API Endpoints

### Health & Status
- `GET /api/health` - Health check endpoint
- `GET /api/health/db` - Database connection check

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics and metrics

### Detection
- `POST /api/detection/start-tests` - Start security detection tests
- `GET /api/detection/status/:id` - Get detection test status

### Reports
- `GET /api/reports` - List all reports
- `GET /api/reports/:id` - Get report details
- `GET /api/reports/:id/download` - Download report (PDF/Excel)

## Project Structure

```
backend/
├── src/
│   ├── db/              # Database related
│   │   ├── database.js          # Database connection (auto-select SQLite/PostgreSQL)
│   │   ├── database-sqlite.js   # SQLite adapter
│   │   ├── init-sqlite.js       # Initialization script
│   │   ├── migrate-sqlite.js    # Migration script
│   │   ├── seed-sqlite.js       # Seed data
│   │   └── reset.js             # Reset script
│   ├── routes/          # Routes
│   │   ├── dashboard.js
│   │   ├── detection.js
│   │   └── reports.js
│   ├── services/        # Business logic
│   │   ├── detectionService.js
│   │   ├── platformAdapter.js
│   │   ├── platforms/   # Platform clients
│   │   │   ├── openaiClient.js
│   │   │   ├── claudeClient.js
│   │   │   └── glmClient.js
│   │   ├── reportService.js
│   │   ├── riskCalculator.js
│   │   └── testExecutor.js
│   └── server.js        # Server entry point
├── data/                # Database files (SQLite)
└── package.json
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_TYPE` | Database type (`sqlite` or `postgres`) | `sqlite` |
| `DB_PATH` | SQLite database file path | `./data/agent_security.db` |
| `DATABASE_URL` | PostgreSQL connection string | - |
| `PORT` | Server port | `8000` |
| `NODE_ENV` | Environment mode | `development` |
| `FRONTEND_URL` | Frontend URL (CORS) | `http://localhost:3000` |

## Dependencies

### Core
- **express** - Web framework
- **better-sqlite3** - SQLite database driver
- **pg** - PostgreSQL client (optional, for PostgreSQL support)
- **socket.io** - WebSocket support for real-time updates
- **dotenv** - Environment variable management

### Utilities
- **axios** - HTTP client for external API calls
- **uuid** - UUID generation
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **express-validator** - Request validation

### Report Generation
- **pdfkit** - PDF report generation
- **exceljs** - Excel report generation

### Development
- **nodemon** - Development server with auto-reload
- **morgan** - HTTP request logger

## Documentation

- [SQLite Compatibility Fixes](./SQLite-Compatibility-Fixes.md) - Guide for migrating from PostgreSQL to SQLite
