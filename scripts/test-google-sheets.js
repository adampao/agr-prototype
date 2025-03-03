#!/usr/bin/env node

/**
 * Test script to verify Google Sheets integration
 * 
 * Run this script with: node scripts/test-google-sheets.js
 */

require('dotenv').config();
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

async function testGoogleSheetsConnection() {
  console.log('Testing Google Sheets integration...\n');
  
  // Check for required environment variables
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
    console.error('Error: GOOGLE_SERVICE_ACCOUNT_EMAIL is not set in .env file');
    process.exit(1);
  }
  
  if (!process.env.GOOGLE_PRIVATE_KEY) {
    console.error('Error: GOOGLE_PRIVATE_KEY is not set in .env file');
    process.exit(1);
  }
  
  if (!process.env.GOOGLE_SHEET_ID) {
    console.error('Warning: GOOGLE_SHEET_ID is not set in .env file, using default test sheet');
  }
  
  const sheetId = process.env.GOOGLE_SHEET_ID || '1RzNnqdEk1PxUi-Ret_uIeMaRxGXmA7xVMV6dLL28DJ4';
  
  try {
    console.log(`Service Account Email: ${process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL}`);
    console.log(`Sheet ID: ${sheetId}`);
    console.log('Private Key: [Verified Present]\n');
    
    // Create a JWT client using service account credentials
    console.log('Creating JWT client...');
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
      ],
    });
    
    // Initialize the sheet
    console.log('Connecting to Google Sheets...');
    const doc = new GoogleSpreadsheet(sheetId, serviceAccountAuth);
    await doc.loadInfo();
    
    console.log(`\nConnection successful!`);
    console.log(`Sheet Title: ${doc.title}`);
    console.log(`Sheets available: ${doc.sheetCount}`);
    
    // Get the first sheet
    const sheet = doc.sheetsByIndex[0];
    console.log(`\nFirst sheet name: ${sheet.title}`);
    console.log(`Rows: ${sheet.rowCount}, Columns: ${sheet.columnCount}`);
    
    // Add a test row
    console.log('\nAdding test row to sheet...');
    await sheet.addRow({
      Timestamp: new Date().toISOString(),
      InterestLevel: 5,
      Feedback: 'This is a test entry from the verification script',
      Email: 'test@example.com',
      SessionId: 'test-session',
      FeaturesUsed: JSON.stringify({ test: true }),
      PageViews: JSON.stringify({ home: 1 })
    });
    
    console.log('\n✅ GOOGLE SHEETS INTEGRATION IS WORKING CORRECTLY!');
    console.log('\nTest row has been added to the sheet. You should see it in your Google Sheet.');
    console.log('You can now safely use the feedback functionality in the application.');
    
  } catch (error) {
    console.error('\n❌ GOOGLE SHEETS INTEGRATION ERROR:');
    console.error(error.message);
    
    if (error.message.includes('invalid_grant') || error.message.includes('Invalid JWT')) {
      console.error('\nPossible issues:');
      console.error('1. The private key format is incorrect (make sure newlines are represented as \\n)');
      console.error('2. The service account email is incorrect');
      console.error('3. The service account does not have access to the spreadsheet');
    }
    
    if (error.message.includes('not found')) {
      console.error('\nPossible issues:');
      console.error('1. The Google Sheet ID is incorrect');
      console.error('2. The sheet does not exist');
      console.error('3. The service account does not have access to the spreadsheet');
      console.error('\nMake sure you have shared the Google Sheet with:');
      console.error(process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);
    }
    
    process.exit(1);
  }
}

testGoogleSheetsConnection();