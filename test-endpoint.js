// test-endpoint.js
const https = require('https');

function testEndpoint() {
  console.log('🧪 Test de l\'endpoint /api/tenants...');

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/test-db',
    method: 'GET',
    rejectUnauthorized: false // Pour le dev local
  };

  const req = https.request(options, (res) => {
    console.log(`📡 Status: ${res.statusCode}`);

    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      try {
        const result = JSON.parse(data);
        console.log('📦 Réponse:', JSON.stringify(result, null, 2));
      } catch (e) {
        console.log('📦 Réponse brute:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Erreur de requête:', error.message);

    // Si HTTPS échoue, essayez HTTP
    console.log('🔄 Essai avec HTTP...');
    testEndpointHTTP();
  });

  req.end();
}

function testEndpointHTTP() {
  const http = require('http');

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/test-db',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`📡 Status HTTP: ${res.statusCode}`);

    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      try {
        const result = JSON.parse(data);
        console.log('📦 Réponse HTTP:', JSON.stringify(result, null, 2));
      } catch (e) {
        console.log('📦 Réponse brute HTTP:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Erreur de requête HTTP:', error.message);
  });

  req.end();
}

testEndpoint();