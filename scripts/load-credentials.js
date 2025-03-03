#!/usr/bin/env node

/**
 * Script to load Google Service Account credentials
 * This helps to set up the environment variables from the credentials file
 * without storing the credentials in git
 */

const fs = require('fs');
const path = require('path');

// Get the path to the credentials file
const credentialsPath = path.join(__dirname, '..', 'agr-demo-feedback-6db66d264a69.json');

try {
  // Check if the credentials file exists
  if (!fs.existsSync(credentialsPath)) {
    console.error('Credentials file not found:', credentialsPath);
    console.error('Make sure to keep a local copy of the credentials file outside of git tracking.');
    process.exit(1);
  }

  // Read the credentials file
  const credentials = JSON.parse(fs.readFileSync(credentialsPath));

  // Print the environment variables to set
  console.log('# Add these environment variables to your .env file or Netlify environment:');
  console.log(`GOOGLE_SERVICE_ACCOUNT_EMAIL=${credentials.client_email}`);
  console.log(`GOOGLE_PRIVATE_KEY="${credentials.private_key.replace(/\n/g, '\\n')}"`);
  
  // For Netlify CLI, you can use this format:
  console.log('\n# For Netlify CLI (netlify env:set):');
  console.log(`netlify env:set GOOGLE_SERVICE_ACCOUNT_EMAIL ${credentials.client_email}`);
  const privateKeyForCommand = credentials.private_key.replace(/\n/g, '\\n').replace(/"/g, '\\"');
  console.log(`netlify env:set GOOGLE_PRIVATE_KEY "${privateKeyForCommand}"`);
  
  console.log('\n✅ Successfully extracted credentials information');
  console.log('You should now set these environment variables in Netlify');
  console.log('Remember to NEVER commit the private key to git!');

} catch (error) {
  console.error('Error processing credentials:', error.message);
  process.exit(1);
}