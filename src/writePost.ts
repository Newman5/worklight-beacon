import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { Post } from './types';
import { loadConfig } from './config';

const POSTS_DIR = 'posts';

// Ensure posts directory exists
if (!fs.existsSync(POSTS_DIR)) {
  fs.mkdirSync(POSTS_DIR, { recursive: true });
}

function generateId(title: string): string {
  const date = new Date().toISOString().split('T')[0];
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 50);
  return `${date}-${slug}`;
}

function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

export async function createPost(): Promise<Post> {
  console.log('\n✍️  Create a new Beacon post\n');

  const title = await prompt('Title: ');
  if (!title) {
    throw new Error('Title is required');
  }

  const contentInput = await prompt('Content (or path to file): ');
  let content: string;

  // Check if input is a file path
  if (fs.existsSync(contentInput)) {
    content = fs.readFileSync(contentInput, 'utf-8');
    console.log(`📄 Loaded content from ${contentInput}`);
  } else {
    content = contentInput;
  }

  if (!content) {
    throw new Error('Content is required');
  }

  const sourceUrl = await prompt('Source URL (optional, press Enter to skip): ');
  const sourceTitle = sourceUrl
    ? await prompt('Source title (optional): ')
    : '';

  const config = loadConfig();
  const id = generateId(title);
  const date = new Date().toISOString();
  const postUrl = `${config.site.baseUrl}/posts/${id}.html`;

  const post: Post = {
    id,
    title,
    date,
    content,
    link: postUrl,
    guid: postUrl,
  };

  if (sourceUrl) {
    post.sourceUrl = sourceUrl;
    if (sourceTitle) {
      post.sourceTitle = sourceTitle;
    }
  }

  return post;
}

export function savePost(post: Post): string {
  const filename = `${post.id}.json`;
  const filepath = path.join(POSTS_DIR, filename);

  fs.writeFileSync(filepath, JSON.stringify(post, null, 2));

  return filepath;
}

export function loadPosts(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) {
    return [];
  }

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.json'));

  const posts: Post[] = [];

  for (const file of files) {
    try {
      const filepath = path.join(POSTS_DIR, file);
      const content = fs.readFileSync(filepath, 'utf-8');
      const post: Post = JSON.parse(content);
      posts.push(post);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      console.error(`⚠️  Warning: Failed to load ${file}: ${err.message}`);
      // Continue loading other posts even if one fails
    }
  }

  // Sort by date, newest first
  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}
