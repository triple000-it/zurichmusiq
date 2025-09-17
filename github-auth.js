#!/usr/bin/env node

const https = require('https');

// Simple GitHub device authentication
async function githubAuth() {
  console.log('🔐 GitHub Device Authentication\n');
  
  try {
    // Request device code from GitHub
    const response = await new Promise((resolve, reject) => {
      const req = https.request('https://github.com/login/device/code', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(JSON.parse(data)));
      });
      
      req.on('error', reject);
      req.write(JSON.stringify({
        client_id: 'Ov23liA2BvUIb1Ilo5oF',
        scope: 'repo user:email'
      }));
      req.end();
    });

    const { device_code, user_code, verification_uri, verification_uri_complete } = response;

    console.log('┌─────────────────────────────────────┐');
    console.log('│                                     │');
    console.log('│  Your Device Code:                  │');
    console.log('│                                     │');
    console.log(`│      ${user_code}                    │`);
    console.log('│                                     │');
    console.log('└─────────────────────────────────────┘\n');

    console.log('📱 Next Steps:');
    console.log(`1. Go to: ${verification_uri_complete}`);
    console.log(`2. Or visit: ${verification_uri}`);
    console.log(`3. Enter the code: ${user_code}`);
    console.log('4. Authorize the application\n');

    console.log('⏳ Waiting for authorization...');

    // Poll for authorization
    const pollInterval = setInterval(async () => {
      try {
        const pollResponse = await new Promise((resolve, reject) => {
          const req = https.request('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            }
          }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)));
          });
          
          req.on('error', reject);
          req.write(JSON.stringify({
            client_id: 'Ov23liA2BvUIb1Ilo5oF',
            device_code: device_code,
            grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
          }));
          req.end();
        });

        if (pollResponse.access_token) {
          clearInterval(pollInterval);
          console.log('\n✅ Authorization successful!');
          console.log('🎉 You are now authenticated as triple000-it');
          console.log('You can now force push to git!');
          process.exit(0);
        } else if (pollResponse.error === 'authorization_pending') {
          process.stdout.write('.');
        } else {
          throw new Error(pollResponse.error_description || pollResponse.error);
        }
      } catch (error) {
        clearInterval(pollInterval);
        console.log(`\n❌ Error: ${error.message}`);
        process.exit(1);
      }
    }, 5000);

    // Timeout after 10 minutes
    setTimeout(() => {
      clearInterval(pollInterval);
      console.log('\n❌ Authentication timed out. Please try again.');
      process.exit(1);
    }, 600000);

  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

githubAuth();
