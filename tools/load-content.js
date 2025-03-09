// load-content.js
const fs = require('fs');
const path = require('path');

// Paths
const CONTENT_DIR = './generated-content';
const KNOWLEDGE_BASE_PATH = '../src/data/knowledge-base.json';

// Read knowledge base
const knowledgeBase = JSON.parse(fs.readFileSync(KNOWLEDGE_BASE_PATH, 'utf8'));

// Get command line arguments
const args = process.argv.slice(2);
if (args.length < 4) {
  console.log('Usage: node load-content.js filename.md "articleId" "domainId" "topicId" "tag1,tag2,tag3"');
  process.exit(1);
}

const [filename, articleId, domainId, topicId, tagString] = args;
const tags = tagString ? tagString.split(',') : [];

// Read the markdown file
const filePath = path.join(CONTENT_DIR, filename);
const fileContent = fs.readFileSync(filePath, 'utf8');

// Extract title from markdown
const titleMatch = fileContent.match(/^# (.+)$/m);
const title = titleMatch ? titleMatch[1] : 'Untitled Article';

// Create new article
const newArticle = {
  id: articleId,
  title: title,
  domainId: domainId,
  topicId: topicId,
  tags: tags,
  content: fileContent
};

// Add to knowledge base
knowledgeBase.articles.push(newArticle);

// Save updated knowledge base
fs.writeFileSync(KNOWLEDGE_BASE_PATH, JSON.stringify(knowledgeBase, null, 2));

console.log(`Added "${title}" to knowledge base as ${articleId}`);