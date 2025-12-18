# User Guide: Writing with Beacon

## Quick Start

### Creating Your First Post

1. Run the write command:
   ```bash
   npm run write
   ```

2. You'll be prompted for:
   - **Title**: A short, descriptive title for your post
   - **Content**: Your post content (or path to a text file)
   - **Source URL** (optional): Link to content you're referencing
   - **Source Title** (optional): Title of the source content

3. Your post is automatically:
   - Saved to `posts/YYYY-MM-DD-slug.json`
   - Added to your RSS feed at `output/feed.rss`
   - Converted to HTML at `output/posts/YYYY-MM-DD-slug.html`

## Writing Tips

### Using a Text Editor

Instead of typing content directly, you can write in your favorite editor:

1. Create a file (e.g., `draft.txt` or `draft.md`)
2. Write your content
3. When prompted for content, enter the file path: `/path/to/draft.txt`

### Post Content

- Keep it simple: plain text works best
- Use `\n\n` (blank lines) for paragraph breaks
- No markdown required in the JSON (HTML generation handles formatting)
- There's no length limit, but RSS readers typically work best with shorter posts

### Linking to Sources

When you reference another article or post:

1. Copy the URL from the source
2. Enter it when prompted for "Source URL"
3. Optionally add the source title
4. Your post will include a citation linking back to the source

Example:
```
Source URL: https://example.com/rss-article
Source Title: The Future of RSS
```

This appears in both RSS and HTML as:
```
→ In response to: The Future of RSS (https://example.com/rss-article)
```

## Manual Editing

### Editing Posts Directly

Posts are just JSON files. You can edit them directly:

1. Open `posts/2025-06-25-my-post.json` in any editor
2. Edit the content, title, or metadata
3. Save the file
4. Regenerate outputs:
   ```bash
   npm run build-feed
   ```

### Post Format

```json
{
  "id": "2025-06-25-my-post",
  "title": "My Post Title",
  "date": "2025-06-25T10:30:00.000Z",
  "content": "Post content here...",
  "link": "https://example.com/posts/2025-06-25-my-post.html",
  "guid": "https://example.com/posts/2025-06-25-my-post.html",
  "sourceUrl": "https://example.com/source",
  "sourceTitle": "Source Title"
}
```

**Required fields:**
- `id` - unique identifier (filename-safe)
- `title` - post title
- `date` - ISO 8601 timestamp
- `content` - post body

**Optional fields:**
- `link` - canonical URL (defaults to generated HTML path)
- `guid` - RSS guid (defaults to link)
- `sourceUrl` - URL you're referencing
- `sourceTitle` - title of source

## Sharing Your Feed

### RSS Feed

Your RSS feed is at: `output/feed.rss`

You can:
- Copy it to a web server
- Commit it to a GitHub Pages site
- Share the URL with RSS readers

### HTML Pages

Static HTML pages are in: `output/posts/`

These can be:
- Hosted on any static site host
- Committed to GitHub Pages
- Shared directly
- Viewed locally in any browser

### Customizing Feed Metadata

Currently, feed metadata is in `src/generateFeed.ts`:

```typescript
const FEED_CONFIG = {
  title: 'My Beacon Feed',
  link: 'https://example.com/feed.rss',
  description: 'Signal from The Beacon',
};
```

Edit these values to customize your feed's metadata.

## Workflow Examples

### Example 1: Link Share

```bash
npm run write
```

```
Title: Great article on RSS
Content: This piece perfectly captures why RSS matters.
Source URL: https://techblog.example/rss-matters
Source Title: Why RSS Still Matters
```

Result: Quick link share with commentary

### Example 2: Long-form Response

1. Write your response in a text editor:
   ```bash
   vim ~/response.txt
   ```

2. Run write command:
   ```bash
   npm run write
   ```

3. Provide the file path:
   ```
   Title: My thoughts on RSS durability
   Content: /home/user/response.txt
   Source URL: https://example.com/article
   Source Title: RSS and Durability
   ```

Result: Full article response with source attribution

### Example 3: Original Note

```bash
npm run write
```

```
Title: Weekend reading recap
Content: Three things I learned this week about the open web...
Source URL: [press Enter to skip]
```

Result: Original post without source reference

## Tips

- ✅ Write regularly to build your signal
- ✅ Reference sources to participate in conversations
- ✅ Keep posts focused and concise
- ✅ Use version control (git) for your posts
- ✅ Back up your `posts/` directory

- ❌ Don't over-edit old posts (maintain durability)
- ❌ Don't delete posts (redirect or mark as outdated instead)
- ❌ Don't worry about perfect formatting
- ❌ Don't stress about post length

## Troubleshooting

### Post not appearing in feed?

Run the build command:
```bash
npm run build-feed
```

### Want to preview HTML locally?

Open in browser:
```bash
open output/posts/2025-06-25-my-post.html
```

Or use a simple HTTP server:
```bash
npx http-server output/posts
```

### Need to change a post date?

Edit the JSON file directly and update the `date` field to a valid ISO 8601 timestamp.

## Advanced Usage

### Batch Creation

You can create multiple posts by manually creating JSON files in `posts/`, then running:

```bash
npm run build-feed
```

### Custom HTML Templates

Edit `src/generateHtml.ts` to customize the HTML template and styling.

### RSS Validation

Validate your feed at: https://validator.w3.org/feed/

---

**Remember:** Beacon is a tool, not a platform. You own your posts, you control your signal.
