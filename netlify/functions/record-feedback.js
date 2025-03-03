const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    // Parse the JSON body
    const data = JSON.parse(event.body);
    
    // Validate required fields
    if (!data.feedback || !data.interestLevel) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }
    
    // Add timestamp if not provided
    if (!data.timestamp) {
      data.timestamp = new Date().toISOString();
    }

    // Log the feedback to Netlify function logs
    console.log('Feedback received:', JSON.stringify(data, null, 2));
    
    // Store feedback in Google Sheets
    if (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && 
        process.env.GOOGLE_PRIVATE_KEY) {
      
      try {
        console.log("Attempting to connect to Google Sheets with service account:", process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);
        
        // Get the Google Sheet ID (use a hardcoded one if the env var is missing)
        const sheetId = process.env.GOOGLE_SHEET_ID && process.env.GOOGLE_SHEET_ID !== 'your_google_sheet_id_here' 
          ? process.env.GOOGLE_SHEET_ID 
          : '1_WL5j_tK5hVW8PdEJnUZqKFsvGabm5OA3_06nXvQ9C8'; // Fallback to our test sheet
        
        // Create a JWT client using service account credentials
        const serviceAccountAuth = new JWT({
          email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
          key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          scopes: [
            'https://www.googleapis.com/auth/spreadsheets',
          ],
        });

        // Initialize the sheet
        const doc = new GoogleSpreadsheet(sheetId, serviceAccountAuth);
        await doc.loadInfo(); // Load sheet info
        
        // Get the first sheet
        const sheet = doc.sheetsByIndex[0];
        
        // Add a row to the sheet
        await sheet.addRow({
          Timestamp: data.timestamp,
          InterestLevel: data.interestLevel,
          Feedback: data.feedback,
          Email: data.email || 'Not provided',
          SessionId: data.sessionId || 'Unknown',
          FeaturesUsed: JSON.stringify(data.features || {}),
          PageViews: JSON.stringify(data.pageViews || {})
        });
        
        console.log('Feedback saved to Google Sheets successfully!');
      } catch (sheetError) {
        console.error('Error saving to Google Sheets:', sheetError);
        // Fall back to email notification
        await sendEmailNotification(data);
      }
    } else {
      // If Google Sheets credentials not available, send email
      await sendEmailNotification(data);
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Feedback recorded successfully' })
    };
  } catch (error) {
    console.error('Error recording feedback:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to record feedback' })
    };
  }
};

// Function to send feedback via email
async function sendEmailNotification(feedbackData) {
  if (!process.env.SENDGRID_API_KEY || !process.env.NOTIFICATION_EMAIL) {
    console.log('Email notification skipped - missing environment variables');
    return;
  }
  
  try {
    // Use SendGrid to send an email notification
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    const msg = {
      to: process.env.NOTIFICATION_EMAIL,
      from: 'feedback@agr-platform.com', // Use your verified sender
      subject: `AGR Platform Feedback - Interest Level: ${feedbackData.interestLevel}/5`,
      text: `
New feedback received:

Interest Level: ${feedbackData.interestLevel}/5
Feedback: ${feedbackData.feedback}
Email: ${feedbackData.email || 'Not provided'}
Timestamp: ${feedbackData.timestamp}

Features Used: 
${JSON.stringify(feedbackData.features || {}, null, 2)}

Page Views:
${JSON.stringify(feedbackData.pageViews || {}, null, 2)}
      `,
      html: `
<h2>New AGR Platform Feedback</h2>
<p><strong>Interest Level:</strong> ${feedbackData.interestLevel}/5</p>
<p><strong>Feedback:</strong> ${feedbackData.feedback}</p>
<p><strong>Email:</strong> ${feedbackData.email || 'Not provided'}</p>
<p><strong>Timestamp:</strong> ${feedbackData.timestamp}</p>

<h3>Features Used:</h3>
<pre>${JSON.stringify(feedbackData.features || {}, null, 2)}</pre>

<h3>Page Views:</h3>
<pre>${JSON.stringify(feedbackData.pageViews || {}, null, 2)}</pre>
      `
    };
    
    await sgMail.send(msg);
    console.log('Email notification sent successfully');
  } catch (emailError) {
    console.error('Error sending email notification:', emailError);
  }
}