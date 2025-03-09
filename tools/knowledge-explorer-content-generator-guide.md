# AGR Knowledge Explorer: System Guide

This document explains the Knowledge Explorer subsystem we've created for the AGR platform, including its architecture, content management workflow, and implementation details.

## Overview

The Knowledge Explorer is a key component of the AGR platform's "Study" section, providing users with structured access to Ancient Greek wisdom organized by domains, topics, and articles. It offers both browsing and search capabilities, allowing users to explore philosophical concepts, historical events, and mythological stories in a user-friendly interface.

## System Architecture

### Components

1. **KnowledgeExplorer.js**: The main React component that implements the UI and state management for the knowledge browsing experience
2. **TimelineViewer.js**: A complementary component that provides interactive chronological exploration of Ancient Greek content
3. **content-generator.js**: A Node.js utility script for generating content templates
4. **load-content.js**: A Node.js utility script for adding content to the knowledge base

### Data Structure

The Knowledge Explorer uses a JSON-based data structure organized in the following hierarchy:

```
knowledge-base.json
├── domains
│   ├── philosophy
│   │   └── topics
│   │       ├── ethics
│   │       ├── metaphysics
│   │       └── ...
│   ├── history
│   └── mythology
└── articles
    ├── virtue-ethics
    ├── socratic-method
    └── ...
```

Each article is linked to a domain and topic through the `domainId` and `topicId` properties, allowing the system to organize and filter content appropriately.

## Content Management Workflow

The Knowledge Explorer uses a streamlined workflow for creating and managing content:

### Step 1: Generate Content Template

```bash
node tools/content-generator.js "Article Title" "Domain" "Topic"
```

This command:
1. Creates a structured template with instructions for creating an article
2. Opens the template file automatically for you to copy
3. Provides a consistent format for article generation

### Step 2: Generate Content with Claude

1. Copy the template from the generated file
2. Paste it into Claude
3. Claude will generate a comprehensive article following the specified structure
4. Review and adjust the content as needed

### Step 3: Save the Content

1. Copy Claude's response
2. Save it as a Markdown file in the `tools/generated-content` directory
3. The filename should follow a consistent format (e.g., `article-title.md`)

### Step 4: Load the Content into the Knowledge Base

```bash
node tools/load-content.js filename.md article-id domain-id topic-id "tag1,tag2,tag3"
```

This command:
1. Reads the Markdown file
2. Creates a properly formatted article object
3. Adds the article to the knowledge base
4. Automatically handles special character escaping in JSON

For example:
```bash
node tools/load-content.js platos-theory-of-forms.md plato-forms philosophy metaphysics "plato,metaphysics,forms,reality,idealism"
```

## Technical Implementation

### Knowledge Explorer Component

The Knowledge Explorer React component provides several key features:

1. **Navigation**: Domain and topic selection for hierarchical browsing
2. **Search**: Full-text search across all content
3. **Article Rendering**: Markdown rendering using ReactMarkdown
4. **Responsive Design**: Adapts to different screen sizes with a sidebar layout on larger screens

Key implementation details:

- **State Management**: Uses React hooks for managing the application state
- **Markdown Rendering**: Implements ReactMarkdown with custom styling components
- **Search Logic**: Simple client-side search with filtering by title, content, and tags

### Content Management Scripts

#### content-generator.js

This script streamlines the content creation process by generating templates for Claude to fill with structured content. It works by:

1. Taking command-line arguments for article details
2. Creating a template file with specific instructions for Claude
3. Opening the file automatically for easy copying
4. Providing a consistent structure for all articles

#### load-content.js

This script handles the technical aspects of adding content to the knowledge base:

1. Reads the Markdown content from the specified file
2. Creates a properly formatted article object with the provided metadata
3. Adds the article to the knowledge base JSON file
4. Handles JSON escaping automatically (avoiding issues with quotes and special characters)
5. Saves the updated knowledge base back to the file

## Timeline Feature

The Timeline component complements the Knowledge Explorer by providing chronological context for Ancient Greek concepts. It uses vis-timeline to display important events, philosophical developments, and mythological narratives on an interactive timeline.

Key features:

- **Domain Filtering**: Separate timelines for Philosophy, History, and Mythology
- **Interactive Details**: Displays contextual information when users click on timeline items
- **Visual Design**: Custom styling that matches the AGR brand colors and aesthetic

## Scalability Considerations

As the knowledge base grows, consider these scaling strategies:

1. **For up to ~50 articles**: Continue with the single JSON file approach
2. **For 50-200 articles**: Split into multiple JSON files by domain/topic
3. **For 200-500 articles**: Implement a simple database like LowDB
4. **For 500+ articles**: Move to a proper database or headless CMS

The content management scripts can be adapted to support these scaling strategies with minimal changes to the application code.

## Customization Options

The Knowledge Explorer can be customized in several ways:

1. **Visual Styling**: Adjust the CSS classes in the components to match your design system
2. **Content Structure**: Modify the domain and topic structure in the knowledge base
3. **Rendering Options**: Customize the ReactMarkdown components for different styling
4. **Search Behavior**: Enhance the search logic with more sophisticated algorithms
5. **Timeline Configuration**: Adjust timeline ranges, colors, and detail display

## Best Practices for Content

When creating content for the Knowledge Explorer, follow these guidelines:

1. **Structure**: Use clear headings, concise paragraphs, and appropriate formatting
2. **Depth**: Provide enough depth to be valuable without overwhelming users
3. **Connections**: Highlight relationships between concepts across different domains
4. **Modern Relevance**: Include connections to contemporary applications
5. **Tags**: Use descriptive tags that facilitate discovery and cross-referencing

## Future Enhancements

The Knowledge Explorer can be enhanced in several ways:

1. **Enhanced Search**: Implement more sophisticated search with relevance ranking
2. **Personalized Recommendations**: Suggest content based on user interests and browsing history
3. **Interactive Elements**: Add quizzes, reflection prompts, or interactive examples
4. **Content Rating System**: Allow users to rate or provide feedback on articles
5. **Export Options**: Enable users to save or export articles for offline reading
6. **Multi-media Integration**: Incorporate images, audio, or video content
7. **Cross-referencing System**: Add better linking between related articles
8. **Progressive Disclosure**: Implement "beginner" to "advanced" views of topics

## Conclusion

The Knowledge Explorer provides a robust foundation for organizing and delivering Ancient Greek wisdom to your users. By following the content management workflow and best practices outlined in this guide, you can build a comprehensive knowledge base that makes ancient wisdom accessible and relevant in the modern world.

The combination of structured content, intuitive navigation, and interactive timelines creates an engaging learning environment that supports users in exploring the depth and richness of Ancient Greek thought.