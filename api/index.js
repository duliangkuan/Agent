// Vercel Serverless Functions entry point
// This file routes all API requests to the appropriate handler

const app = require('../backend/src/server');

// Export as Vercel serverless function
module.exports = app;

