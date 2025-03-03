# AGR Platform Feedback Collection System

This document provides instructions for setting up the feedback collection system for the AGR Platform demo.

## Overview

The feedback system collects user feedback and interaction data from the AGR Platform demo to help with product development and investor presentations. It consists of:

1. A client-side analytics service that tracks page views and feature usage
2. A feedback form that appears after users engage with the platform
3. A Netlify serverless function that processes the feedback
4. Storage of feedback data in Google Sheets and/or email notifications

## Quick Setup Guide

For quick setup using our pre-configured Google Sheet:

1. The service account JSON file is already included in the project as `agr-demo-feedback-6db66d264a69.json`
2. The environment variables are already set in the `.env` file
3. Run `npm run test:sheets` to verify the Google Sheets integration works
4. Make sure you've shared [this Google Sheet](https://docs.google.com/spreadsheets/d/1RzNnqdEk1PxUi-Ret_uIeMaRxGXmA7xVMV6dLL28DJ4/edit) with the service account email: `agr-demo-feedback@agr-demo-feedback.iam.gserviceaccount.com`

## Detailed Setup Instructions (If Creating Your Own Sheet)

### 1. Google Sheets Setup

1. Create a new Google Sheet to store feedback data
2. Set up the sheet with the following columns:
   - Timestamp
   - InterestLevel
   - Feedback
   - Email
   - SessionId
   - FeaturesUsed
   - PageViews

3. Create a Google Service Account:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project (or use an existing one)
   - Enable the Google Sheets API
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "Service Account"
   - Fill in the service account details and create
   - Click on the service account you created
   - Go to the "Keys" tab
   - Click "Add Key" > "Create new key" > JSON
   - Download the JSON key file

4. Share your Google Sheet with the service account email address (it will look like `something@project-id.iam.gserviceaccount.com`)

### 2. Environment Variables Configuration

Add the following environment variables to your Netlify site or update the `.env` file:

```
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account-email@project-id.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key content with \n for line breaks\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=your-google-sheet-id-from-url
```

Notes:
- The Google Sheet ID is the long string of characters in the URL when you open your sheet
- For the private key, make sure to replace actual newlines with \n and wrap in quotes

## Verifying the Setup

We've included a test script to verify your Google Sheets integration. Run:

```
npm run test:sheets
```

This will:
1. Test your environment variables
2. Attempt to connect to your Google Sheet
3. Add a test row to verify write permission
4. Report any issues and suggest solutions

## Troubleshooting

### Common Issues

1. **Sheet Permission Issues**:
   - Make sure you've shared the Google Sheet with the service account email
   - Ensure the service account has edit access, not just view access

2. **Private Key Format**:
   - The private key must have `\n` for newlines, not actual newlines
   - The private key must be wrapped in quotes in the `.env` file

3. **Google Sheet ID**:
   - The ID is the long string in the URL: `https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID_HERE/edit`

### Testing Functions Locally

If you want to test the functions locally:

1. Install Netlify CLI: `npm install -g netlify-cli`
2. Run the functions locally: `netlify dev`
3. Send a test request to: `http://localhost:8888/.netlify/functions/record-feedback`

## Security Considerations

- The GOOGLE_PRIVATE_KEY is sensitive information. Only store it in environment variables.
- The system collects anonymous usage data by default, with email being optional.
- No personally identifiable information is collected without user consent.

## Need Help?

If you're still having issues, check:
1. The Netlify function logs for error details
2. That your service account has edit access to the sheet
3. Run the test script with `npm run test:sheets` for detailed diagnostics