const http = require('http');

const data = JSON.stringify({
    employeeId: 'TEST-1234',
    firstName: 'Test'
});

const options = {
    hostname: 'localhost',
    port: 2530,
    path: '/api/users/cm7dhl6rt0000aov21vovx0l2', // Just need ANY valid user ID to hit the endpoint. Wait, Auth is required.
    method: 'PATCH',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();
