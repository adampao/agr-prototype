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
    
    // Handle analytics data
    if (data.type === 'analytics') {
      console.log('Analytics data received:', JSON.stringify(data, null, 2));
      
      // Store analytics in Google Sheets if credentials are available
      if (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && 
          process.env.GOOGLE_PRIVATE_KEY) {
        
        try {
          await storeAnalyticsInSheet(data);
        } catch (error) {
          console.error('Error storing analytics in Google Sheets:', error);
        }
      }
      
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Analytics recorded successfully' })
      };
    }
    
    // Validate required fields for feedback submissions
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
    
    // Try to store feedback in Google Sheets, but fallback to email in all cases
    let googleSheetsSuccess = false;
    
    if (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && 
        process.env.GOOGLE_PRIVATE_KEY) {
      
      try {
        console.log("Attempting to connect to Google Sheets with service account:", process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);
        
        // Get the Google Sheet ID (use a hardcoded one if the env var is missing)
        const sheetId = process.env.GOOGLE_SHEET_ID && process.env.GOOGLE_SHEET_ID !== 'your_google_sheet_id_here' 
          ? process.env.GOOGLE_SHEET_ID 
          : '1RzNnqdEk1PxUi-Ret_uIeMaRxGXmA7xVMV6dLL28DJ4'; // Fallback to our production sheet
        
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
        
        // Format feature usage for better readability
        let formattedFeatures = 'None';
        if (data.features && Object.keys(data.features).length > 0) {
          formattedFeatures = Object.entries(data.features)
            .map(([feature, count]) => `${feature}: ${count} times`)
            .join('; ');
        } else if (data.usageSummary && data.usageSummary.featureUsage) {
          // Use the pre-formatted feature usage if available
          formattedFeatures = data.usageSummary.featureUsage;
        }
        
        // Format page views for better readability
        let formattedPageViews = 'None';
        if (data.pageViews && Object.keys(data.pageViews).length > 0) {
          formattedPageViews = Object.entries(data.pageViews)
            .map(([page, count]) => `${page}: ${count} views`)
            .join('; ');
        } else if (data.usageSummary && data.usageSummary.pageViews) {
          // Use the pre-formatted page views if available
          formattedPageViews = data.usageSummary.pageViews;
        }
        
        // Format ratings for consistency
        const formatRating = (ratingObj) => {
          if (!ratingObj) return 'Not rated';
          return ratingObj.notTested ? 'Not tested' : `${ratingObj.rating || 0}/5`;
        };
        
        // Add a row to the sheet
        await sheet.addRow({
          Timestamp: data.timestamp,
          InterestLevel: data.interestLevel,
          Feedback: data.feedback,
          Email: data.email || 'Not provided',
          SessionId: data.sessionId || 'Unknown',
          FeaturesUsed: formattedFeatures,
          PageViews: formattedPageViews,
          Source: data.source || 'popup', // Track where feedback came from
          ContactOk: data.contactOk ? 'Yes' : 'No',
          JournalRating: formatRating(data.pageRatings?.journal),
          StudyRating: formatRating(data.pageRatings?.study),
          AgoraRating: formatRating(data.pageRatings?.agora),
          VisitCount: data.usageSummary?.visitCount || 1,
          FirstVisit: data.usageSummary?.firstVisit || 'Unknown',
          LastVisit: data.usageSummary?.lastVisit || 'Unknown'
        });
        
        googleSheetsSuccess = true;
      } catch (sheetError) {
        console.error('Error saving to Google Sheets:', sheetError);
        googleSheetsSuccess = false;
      }
    }
    
    // Always send an email notification as a reliable backup
    // This ensures we never lose feedback, even if the Google credentials are revoked
    await sendEmailNotification(data);
    
    // For analytics tracking, still count as success
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Feedback recorded successfully', method: googleSheetsSuccess ? 'sheets+email' : 'email' })
    };
  } catch (error) {
    console.error('Error recording feedback:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to record feedback' })
    };
  }
};

// Function to store analytics data in Google Sheets
async function storeAnalyticsInSheet(analyticsData) {
  // Get the Google Sheet ID
  const sheetId = process.env.GOOGLE_SHEET_ID && process.env.GOOGLE_SHEET_ID !== 'your_google_sheet_id_here' 
    ? process.env.GOOGLE_SHEET_ID 
    : '1RzNnqdEk1PxUi-Ret_uIeMaRxGXmA7xVMV6dLL28DJ4'; // Fallback to our production sheet
  
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
  
  // Get the analytics sheet (second sheet)
  let sheet;
  try {
    sheet = doc.sheetsByIndex[1]; // Try to use the second sheet for analytics
  } catch (error) {
    // If second sheet doesn't exist, create it
    sheet = await doc.addSheet({ 
      title: 'Analytics Data',
      headerValues: ['Timestamp', 'SessionId', 'Type', 'Feature', 'FeatureDetails', 'PageView', 'EventData'] 
    });
  }
  
  const event = analyticsData.event || analyticsData.data || {};
  const timestamp = analyticsData.timestamp || new Date().toISOString();
  const sessionId = analyticsData.sessionId || event.sessionId || 'Unknown';
  
  // Format feature usage data if this is a feature event
  let feature = '';
  let featureDetails = '';
  let formattedEventData = '';
  
  if (event.type === 'featureUse') {
    feature = event.feature || '';
    
    // If it's an improved analytics format
    if (event.featureFormatted) {
      featureDetails = event.featureFormatted;
      formattedEventData = event.allFeaturesUsed || '';
    } else {
      // Handle the older format
      featureDetails = `${feature} (used)`;
      
      // Check if we have the analyticsData object with features
      if (analyticsData.analyticsData && analyticsData.analyticsData.features) {
        formattedEventData = Object.entries(analyticsData.analyticsData.features)
          .map(([name, count]) => `${name}: ${count}`)
          .join('; ');
      } else {
        formattedEventData = JSON.stringify(event.details || {});
      }
    }
  } else {
    // For non-feature events, just stringify the data
    formattedEventData = JSON.stringify(event);
  }
  
  let pageView = '';
  if (event.type === 'pageView') {
    pageView = event.page || '';
  }
  
  // Add a row to the sheet with improved formatting
  await sheet.addRow({
    Timestamp: timestamp,
    SessionId: sessionId,
    Type: event.type || 'Unknown',
    Feature: feature,
    FeatureDetails: featureDetails,
    PageView: pageView,
    EventData: formattedEventData
  });
}

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
    
    // Determine the source of the feedback
    const source = feedbackData.source || 'popup';
    const contactOk = feedbackData.contactOk ? 'Yes' : 'No';
    const likedFeature = feedbackData.likedFeature || 'Not specified';
    
    // Format feature usage for better readability
    let formattedFeatures = 'None';
    if (feedbackData.features && Object.keys(feedbackData.features).length > 0) {
      formattedFeatures = Object.entries(feedbackData.features)
        .map(([feature, count]) => `${feature}: ${count} times`)
        .join('\n');
    } else if (feedbackData.usageSummary && feedbackData.usageSummary.featureUsage) {
      // Use the pre-formatted feature usage if available
      formattedFeatures = feedbackData.usageSummary.featureUsage.replace(/;/g, '\n');
    }
    
    // Format page views for better readability
    let formattedPageViews = 'None';
    if (feedbackData.pageViews && Object.keys(feedbackData.pageViews).length > 0) {
      formattedPageViews = Object.entries(feedbackData.pageViews)
        .map(([page, count]) => `${page}: ${count} views`)
        .join('\n');
    } else if (feedbackData.usageSummary && feedbackData.usageSummary.pageViews) {
      // Use the pre-formatted page views if available
      formattedPageViews = feedbackData.usageSummary.pageViews.replace(/;/g, '\n');
    }
    
    // Format ratings for email
    const formatRating = (ratingObj) => {
      if (!ratingObj) return 'Not rated';
      return ratingObj.notTested ? "Not Tested" : (ratingObj.rating || "0") + "/5";
    };
    
    const msg = {
      to: process.env.NOTIFICATION_EMAIL,
      from: 'feedback@agr-platform.com', // Use your verified sender
      subject: `AGR Platform Feedback - ${source === 'footer' ? 'Footer Form' : `Interest Level: ${feedbackData.interestLevel}/5`}`,
      text: `
New feedback received from ${source}:

${source !== 'footer' ? `Interest Level: ${feedbackData.interestLevel}/5` : ''}
Feedback: ${feedbackData.feedback}
Email: ${feedbackData.email || 'Not provided'}
${source === 'footer' ? `Liked Feature: ${likedFeature}` : ''}
Contact OK: ${contactOk}
Timestamp: ${feedbackData.timestamp}
SessionId: ${feedbackData.sessionId || 'Unknown'}
Visit Count: ${feedbackData.usageSummary?.visitCount || 1}
First Visit: ${feedbackData.usageSummary?.firstVisit || 'Unknown'}

Page Ratings:
Journal: ${formatRating(feedbackData.pageRatings?.journal)}
Study: ${formatRating(feedbackData.pageRatings?.study)}
Agora: ${formatRating(feedbackData.pageRatings?.agora)}

Features Used: 
${formattedFeatures}

Page Views:
${formattedPageViews}
      `,
      html: `
<h2>New AGR Platform Feedback (${source})</h2>
${source !== 'footer' ? `<p><strong>Interest Level:</strong> ${feedbackData.interestLevel}/5</p>` : ''}
<p><strong>Feedback:</strong> ${feedbackData.feedback}</p>
<p><strong>Email:</strong> ${feedbackData.email || 'Not provided'}</p>
${source === 'footer' ? `<p><strong>Liked Feature:</strong> ${likedFeature}</p>` : ''}
<p><strong>Contact OK:</strong> ${contactOk}</p>
<p><strong>Timestamp:</strong> ${feedbackData.timestamp}</p>
<p><strong>Session ID:</strong> ${feedbackData.sessionId || 'Unknown'}</p>
<p><strong>Visit Count:</strong> ${feedbackData.usageSummary?.visitCount || 1}</p>
<p><strong>First Visit:</strong> ${feedbackData.usageSummary?.firstVisit || 'Unknown'}</p>

<h3>Page Ratings:</h3>
<p><strong>Journal:</strong> ${formatRating(feedbackData.pageRatings?.journal)}</p>
<p><strong>Study:</strong> ${formatRating(feedbackData.pageRatings?.study)}</p>
<p><strong>Agora:</strong> ${formatRating(feedbackData.pageRatings?.agora)}</p>

<h3>Features Used:</h3>
<pre>${formattedFeatures}</pre>

<h3>Page Views:</h3>
<pre>${formattedPageViews}</pre>
      `
    };
    
    await sgMail.send(msg);
    
  } catch (emailError) {
    console.error('Error sending email notification:', emailError);
  }
}