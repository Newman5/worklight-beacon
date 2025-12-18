import fs from 'fs';
import path from 'path';
import { Post } from './types';
import { loadPosts } from './writePost';
import { loadConfig } from './config';

const OUTPUT_DIR = 'output';
const FEED_PATH = path.join(OUTPUT_DIR, 'feed.rss');

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function formatRssDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toUTCString();
}

function generateRssItem(post: Post, baseUrl: string): string {
  const guid = post.guid || post.link || `${baseUrl}/posts/${post.id}.html`;
  const link = post.link || `${baseUrl}/posts/${post.id}.html`;

  let description = escapeXml(post.content);

  // If there's a source, add a reference at the end
  if (post.sourceUrl) {
    const sourceNote = post.sourceTitle
      ? `\n\n→ In response to: ${post.sourceTitle} (${post.sourceUrl})`
      : `\n\n→ In response to: ${post.sourceUrl}`;
    description += escapeXml(sourceNote);
  }

  return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid>${escapeXml(guid)}</guid>
      <pubDate>${formatRssDate(post.date)}</pubDate>
      <description><![CDATA[${description}]]></description>
    </item>`;
}

export function generateRssFeed(posts: Post[]): string {
  const config = loadConfig();
  const now = new Date().toUTCString();

  const items = posts.map((post) => generateRssItem(post, config.site.baseUrl)).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(config.feed.title)}</title>
    <link>${escapeXml(config.feed.link)}</link>
    <description>${escapeXml(config.feed.description)}</description>
    <lastBuildDate>${now}</lastBuildDate>
${items}
  </channel>
</rss>`;
}

export function buildFeed(): void {
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const posts = loadPosts();

  if (posts.length === 0) {
    console.log('📭 No posts found. Create your first post with: npm run write');
    return;
  }

  const rss = generateRssFeed(posts);

  fs.writeFileSync(FEED_PATH, rss);

  console.log(`✅ RSS feed generated: ${FEED_PATH}`);
  console.log(`   ${posts.length} post(s) included`);
}
