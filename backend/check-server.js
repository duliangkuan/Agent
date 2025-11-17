const http = require('http');

console.log('=== Backend Service Check Tool ===\n');

// 1. Check port
console.log('[1/4] Checking port 8000...');
const portCheck = new Promise((resolve) => {
  const req = http.get('http://localhost:8000/api/health', { timeout: 3000 }, (res) => {
    resolve({ success: true, statusCode: res.statusCode });
  });
  
  req.on('error', (err) => {
    resolve({ success: false, error: err.message });
  });
  
  req.on('timeout', () => {
    req.destroy();
    resolve({ success: false, error: 'Connection timeout' });
  });
});

portCheck.then((result) => {
  if (result.success) {
    console.log('  ✓ Port 8000 is listening');
    console.log(`  Status code: ${result.statusCode}`);
  } else {
    console.log(`  ✗ Port 8000 not responding: ${result.error}`);
  }
  
  // 2. Test API health check
  console.log('\n[2/4] Testing API health check...');
  return new Promise((resolve) => {
    const req = http.get('http://localhost:8000/api/health', { timeout: 3000 }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({ success: true, statusCode: res.statusCode, data });
      });
    });
    
    req.on('error', (err) => {
      resolve({ success: false, error: err.message });
    });
    
    req.on('timeout', () => {
      req.destroy();
      resolve({ success: false, error: 'Connection timeout' });
    });
  });
}).then((result) => {
  if (result.success) {
    console.log('  ✓ API responding normally');
    console.log(`  Response: ${result.data}`);
  } else {
    console.log(`  ✗ API not responding: ${result.error}`);
  }
  
  // 3. Test database connection
  console.log('\n[3/4] Testing database connection...');
  return new Promise((resolve) => {
    const req = http.get('http://localhost:8000/api/health/db', { timeout: 3000 }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({ success: true, statusCode: res.statusCode, data });
      });
    });
    
    req.on('error', (err) => {
      resolve({ success: false, error: err.message });
    });
    
    req.on('timeout', () => {
      req.destroy();
      resolve({ success: false, error: 'Connection timeout' });
    });
  });
}).then((result) => {
  if (result.success) {
    console.log('  ✓ Database connection normal');
    console.log(`  Response: ${result.data}`);
  } else {
    console.log(`  ✗ Database check failed: ${result.error}`);
  }
  
  // 4. Check database file
  console.log('\n[4/4] Checking database file...');
  const fs = require('fs');
  const path = require('path');
  const dbPath = path.join(__dirname, 'data', 'agent_security.db');
  
  if (fs.existsSync(dbPath)) {
    const stats = fs.statSync(dbPath);
    console.log('  ✓ Database file exists');
    console.log(`  Path: ${dbPath}`);
    console.log(`  Size: ${(stats.size / 1024).toFixed(2)} KB`);
    console.log(`  Modified: ${stats.mtime.toLocaleString()}`);
  } else {
    console.log('  ✗ Database file does not exist');
    console.log(`  Expected path: ${dbPath}`);
  }
  
  console.log('\n=== Check Completed ===\n');
  console.log('Access URLs:');
  console.log('  API: http://localhost:8000/api');
  console.log('  Health check: http://localhost:8000/api/health');
  console.log('  Database check: http://localhost:8000/api/health/db\n');
  
  process.exit(0);
}).catch((error) => {
  console.error('Error during check:', error);
  process.exit(1);
});
