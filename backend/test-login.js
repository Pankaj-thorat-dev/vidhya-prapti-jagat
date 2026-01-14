/**
 * Quick test script to verify login API works
 * Run: node test-login.js
 */

const http = require('http');

const testLogin = () => {
  const data = JSON.stringify({
    email: 'admin@test.com',
    password: 'admin123'
  });

  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  console.log('🧪 Testing login API...\n');
  console.log('Request:', {
    url: 'http://localhost:5000/api/auth/login',
    method: 'POST',
    body: { email: 'admin@test.com', password: 'admin123' }
  });
  console.log('\n---\n');

  const req = http.request(options, (res) => {
    let responseData = '';

    res.on('data', (chunk) => {
      responseData += chunk;
    });

    res.on('end', () => {
      console.log('Status Code:', res.statusCode);
      console.log('\nResponse:');
      
      try {
        const parsed = JSON.parse(responseData);
        console.log(JSON.stringify(parsed, null, 2));
        
        if (res.statusCode === 200 && parsed.success) {
          console.log('\n✅ LOGIN API WORKS!');
          console.log('\n✅ Token generated:', parsed.data.token ? 'Yes' : 'No');
          console.log('✅ User data returned:', parsed.data.user ? 'Yes' : 'No');
          
          if (parsed.data.user) {
            console.log('\nUser Details:');
            console.log('  - Name:', parsed.data.user.name);
            console.log('  - Email:', parsed.data.user.email);
            console.log('  - Role:', parsed.data.user.role);
          }
        } else {
          console.log('\n❌ LOGIN FAILED');
          console.log('Message:', parsed.message);
        }
      } catch (e) {
        console.log(responseData);
        console.log('\n❌ Invalid JSON response');
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ ERROR:', error.message);
    console.log('\n💡 Make sure:');
    console.log('  1. Backend server is running (npm run dev)');
    console.log('  2. Server is on port 5000');
    console.log('  3. MongoDB is connected');
  });

  req.write(data);
  req.end();
};

// Run test
testLogin();
