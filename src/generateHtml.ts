import fs from 'fs';
import path from 'path';
import { Post } from './types';
import { loadPosts } from './writePost';
import { loadConfig } from './config';

const OUTPUT_DIR = path.join('output', 'posts');

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function processContent(content: string): string {
  // Check if content contains HTML tags
  const hasHtmlTags = /<[^>]+>/.test(content);
  
  if (hasHtmlTags) {
    // Content has HTML - preserve it but still handle paragraph breaks
    return content.split('\n\n').map(para => {
      // Don't wrap if paragraph already starts with a block-level tag
      if (para.trim().match(/^<(p|div|h[1-6]|ul|ol|blockquote|pre|img)/i)) {
        return para;
      }
      return `<p>${para.replace(/\n/g, '<br>')}</p>`;
    }).join('\n');
  } else {
    // Plain text - escape and format
    return escapeHtml(content)
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>');
  }
}

function generateHtmlPage(post: Post): string {
  const date = formatDate(post.date);
  const contentHtml = processContent(post.content);

  let sourceHtml = '';
  if (post.sourceUrl) {
    const sourceTitle = post.sourceTitle || post.sourceUrl;
    sourceHtml = `
      <div class="source">
        <p><strong>→ In response to:</strong> <a href="${escapeHtml(post.sourceUrl)}">${escapeHtml(sourceTitle)}</a></p>
      </div>`;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(post.title)}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
      line-height: 1.6;
      max-width: 650px;
      margin: 40px auto;
      padding: 0 20px;
      color: #333;
      background: #fff;
    }
    h1 {
      font-size: 2em;
      margin-bottom: 0.5em;
      color: #FFA500;
    }
    .meta {
      color: #666;
      font-size: 0.9em;
      margin-bottom: 2em;
    }
    .content {
      margin: 2em 0;
    }
    .content p {
      margin: 1em 0;
    }
    .content img {
      max-width: 100%;
      height: auto;
      margin: 1em 0;
      border-radius: 4px;
    }
    .content a {
      color: #FFA500;
      text-decoration: underline;
    }
    .source {
      margin-top: 2em;
      padding: 1em;
      background: #f5f5f5;
      border-left: 4px solid #FFA500;
    }
    .footer {
      margin-top: 4em;
      padding-top: 2em;
      border-top: 1px solid #ddd;
      color: #666;
      font-size: 0.9em;
    }
    a {
      color: #FFA500;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <article>
    <h1>${escapeHtml(post.title)}</h1>
    <div class="meta">
      <time datetime="${post.date}">${date}</time>
    </div>
    <div class="content">
      ${contentHtml}
    </div>
    ${sourceHtml}
  </article>
  <footer class="footer">
    <p>🧡 Published via <a href="https://github.com/Newman5/worklight-beacon">The Beacon</a></p>
  </footer>
</body>
</html>`;
}

export function generateHtmlPages(posts?: Post[]): void {
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const postsToGenerate = posts || loadPosts();

  if (postsToGenerate.length === 0) {
    console.log('📭 No posts found to generate HTML pages.');
    return;
  }

  for (const post of postsToGenerate) {
    const filename = `${post.id}.html`;
    const filepath = path.join(OUTPUT_DIR, filename);
    const html = generateHtmlPage(post);
    fs.writeFileSync(filepath, html);
  }

  console.log(`✅ HTML pages generated: ${OUTPUT_DIR}/`);
  console.log(`   ${postsToGenerate.length} page(s) created`);
}
