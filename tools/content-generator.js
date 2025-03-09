// Run this with Node.js to generate article content
// Usage: node content-generator.js "Article Title" "Domain" "Topic"

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Replace with your actual API key (store this securely in a .env file in production)
// const CLAUDE_API_KEY = 'your-api-key-here';

// Configuration
const OUTPUT_DIR = './generated-content';
const TEMPLATE_PATH = './content-template.md';

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Get arguments
const args = process.argv.slice(2);
if (args.length < 3) {
  console.log('Usage: node content-generator.js "Article Title" "Domain" "Topic"');
  process.exit(1);
}

const [title, domain, topic] = args;

// Create filename from title
const filename = title
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '') + '.md';

const outputPath = path.join(OUTPUT_DIR, filename);

// Since we don't have direct API access in this simple script,
// we'll generate a template that you can paste into Claude UI
const generateTemplate = () => {
  const template = `# Content Generation Request for AGR Knowledge Explorer

## Article Details
- Title: ${title}
- Domain: ${domain}
- Topic: ${topic}

## Request
Please write a comprehensive article on "${title}" for the AGR platform's Knowledge Explorer. 
The article should be written in Markdown format with the following structure:

1. A main title (H1)
2. An introduction that explains the concept and its significance in ancient Greek context
3. 2-4 main sections (H2) exploring different aspects of the topic
4. Optional subsections (H3) as needed
5. A conclusion that connects the ancient concept to modern relevance

The article should be informative, engaging, and around 500-800 words. Include any relevant Greek terms with translations.

Please provide only the Markdown content without additional commentary.

## Additional Guidelines
- Include 5-7 relevant tags for the article
- Focus on accuracy and educational value
- Keep the language accessible but not oversimplified
- Connect to other relevant philosophical concepts when appropriate
`;

  fs.writeFileSync(TEMPLATE_PATH, template);
  console.log(`Template created at ${TEMPLATE_PATH}`);
  
  // Open the template file
  let command;
  switch (process.platform) {
    case 'darwin': // macOS
      command = `open "${TEMPLATE_PATH}"`;
      break;
    case 'win32': // Windows
      command = `start "" "${TEMPLATE_PATH}"`;
      break;
    default: // Linux and others
      command = `xdg-open "${TEMPLATE_PATH}"`;
  }
  
  exec(command, (error) => {
    if (error) {
      console.error(`Error opening file: ${error}`);
    }
  });
  
  console.log('\nInstructions:');
  console.log('1. Copy the template content');
  console.log('2. Paste it into Claude');
  console.log('3. Copy Claude\'s response');
  console.log(`4. Save it to ${outputPath}`);
};

// If we had API access, we could directly call Claude:
// const generateContentWithAPI = async () => {
//   // API call implementation would go here
// };

generateTemplate();
console.log(`\nGenerating template for article: "${title}" (${domain} > ${topic})`);