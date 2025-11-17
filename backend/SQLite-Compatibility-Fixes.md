# SQLite Compatibility Fixes

## Problem Description

After switching from PostgreSQL to SQLite, some API endpoints returned 500 errors due to PostgreSQL-specific SQL syntax usage.

## Fixed Issues

### 1. dashboard.js - Date Functions

**Problem**:
- `DATE(created_at)` - PostgreSQL syntax
- `NOW() - INTERVAL '7 days'` - PostgreSQL syntax

**Fix**:
- `date(created_at)` - SQLite syntax
- `datetime('now', '-7 days')` - SQLite syntax

### 2. dashboard.js - FILTER Syntax

**Problem**:
```sql
COUNT(*) FILTER (WHERE nist_ai_rmf_status = 'passed')
```
SQLite does not support `FILTER` clause.

**Fix**:
```sql
SUM(CASE WHEN nist_ai_rmf_status = 'passed' THEN 1 ELSE 0 END)
```

### 3. detectionService.js - Timestamps

**Problem**:
- `CURRENT_TIMESTAMP` - Although SQLite supports it, we use `datetime('now')` for consistency

**Fix**:
- All `CURRENT_TIMESTAMP` changed to `datetime('now')`

### 4. detectionService.js - Array Handling

**Problem**:
- PostgreSQL supports array type `TEXT[]`
- SQLite requires arrays to be stored as JSON strings

**Fix**:
```javascript
const modulesJson = JSON.stringify(modules);
// Store as JSON string
```

## Fixed Files

1. `backend/src/routes/dashboard.js`
   - Fixed date queries
   - Fixed FILTER syntax

2. `backend/src/services/detectionService.js`
   - Fixed timestamp functions
   - Fixed array storage

## Test Results

### API Endpoint Test

```bash
# Test dashboard stats
curl http://localhost:8000/api/dashboard/stats
```

**Response**:
```json
{
  "totalDetections": 0,
  "riskDistribution": [],
  "recentTrends": [],
  "complianceStatus": [
    {"name": "NIST AI RMF", "passed": 0, "failed": 0},
    {"name": "EU AI Act", "passed": 0, "failed": 0},
    {"name": "ISO 42001", "passed": 0, "failed": 0},
    {"name": "UNESCO", "passed": 0, "failed": 0},
    {"name": "UN 10 Principles", "passed": 0, "failed": 0}
  ]
}
```

✅ **API now works correctly**

## SQL Syntax Comparison Table

| PostgreSQL | SQLite | Description |
|-----------|--------|-------------|
| `DATE(column)` | `date(column)` | Date function |
| `NOW()` | `datetime('now')` | Current time |
| `NOW() - INTERVAL '7 days'` | `datetime('now', '-7 days')` | Date calculation |
| `CURRENT_TIMESTAMP` | `datetime('now')` | Current timestamp |
| `COUNT(*) FILTER (WHERE ...)` | `SUM(CASE WHEN ... THEN 1 ELSE 0 END)` | Conditional count |
| `TEXT[]` | `TEXT` (JSON) | Array type |

## Notes

1. **Array Fields**: In SQLite, array fields are stored as JSON strings, use `JSON.parse()` when reading

2. **Date Format**: SQLite stores dates and times in ISO 8601 format

3. **NULL Handling**: SQLite's NULL handling differs slightly from PostgreSQL, be aware

## Verification

Run the following command to verify fixes:

```bash
cd backend
node check-server.js
```

All checks should pass.

## Future Recommendations

If other API endpoints have issues, check for:
- PostgreSQL-specific date functions
- `FILTER` clauses
- Array operations
- Other PostgreSQL-specific syntax

Then fix according to the comparison table above.

