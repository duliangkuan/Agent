const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Get database file path
const dbPath = process.env.DB_PATH || path.join(__dirname, '../../data/agent_security.db');
const dbDir = path.dirname(dbPath);

// Ensure data directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Create database connection
const db = new Database(dbPath);

// Enable foreign key constraints
db.pragma('foreign_keys = ON');

// Wrap as pg Pool-like interface
const pool = {
  // Execute query (returns results)
  query: async (sql, params = []) => {
    try {
      // Convert PostgreSQL parameter placeholders $1, $2 to SQLite's ?
      let processedSql = sql;
      const processedParams = [];
      
      if (params && params.length > 0) {
        // Replace $1, $2, $3... with ?
        processedSql = sql.replace(/\$(\d+)/g, (match, index) => {
          const paramIndex = parseInt(index) - 1;
          if (paramIndex < params.length) {
            processedParams.push(params[paramIndex]);
          }
          return '?';
        });
      }
      
      // Handle PostgreSQL-specific syntax (before query execution)
      // Note: These replacements should be done before SQL preparation
      
      // Determine if it's SELECT or other operation
      const isSelect = processedSql.trim().toUpperCase().startsWith('SELECT');
      
      // Check if there's a RETURNING clause
      const returningMatch = processedSql.match(/RETURNING\s+(\w+)/i);
      const returningColumn = returningMatch ? returningMatch[1] : null;
      
      if (isSelect) {
        const stmt = db.prepare(processedSql);
        const rows = stmt.all(...processedParams);
        return { rows };
      } else {
        // INSERT, UPDATE, DELETE
        const stmt = db.prepare(processedSql.replace(/RETURNING\s+\w+/i, ''));
        const info = stmt.run(...processedParams);
        
        // If there's a RETURNING clause, return the inserted ID
        if (returningColumn && info.lastInsertRowid) {
          return {
            rows: [{ [returningColumn]: info.lastInsertRowid, id: info.lastInsertRowid }],
            rowCount: info.changes,
            lastInsertRowid: info.lastInsertRowid,
          };
        }
        
        return {
          rows: [],
          rowCount: info.changes,
          lastInsertRowid: info.lastInsertRowid,
        };
      }
    } catch (error) {
      console.error('SQLite query error:', error.message);
      console.error('SQL:', sql);
      throw error;
    }
  },
  
  // Test connection
  testConnection: async () => {
    try {
      const result = await pool.query("SELECT datetime('now') as now");
      console.log('Database connection test successful:', result.rows[0].now);
      return true;
    } catch (error) {
      console.error('Database connection test failed:', error.message);
      return false;
    }
  },
  
  // Close connection
  end: async () => {
    db.close();
  },
  
  // Get raw database instance (for special operations)
  getRaw: () => db,
  
  // Helper method: extract table name from SQL
  getTableName: (sql) => {
    const insertMatch = sql.match(/INSERT\s+INTO\s+(\w+)/i);
    if (insertMatch) return insertMatch[1];
    const updateMatch = sql.match(/UPDATE\s+(\w+)/i);
    if (updateMatch) return updateMatch[1];
    return null;
  },
};

// Connection events (not needed for SQLite, but kept for compatibility)
pool.on = () => {};

module.exports = pool;

