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

#### Including Links in Content

To include links in your post content, use plain URLs or simple markdown-style syntax:

**Plain URLs:** Just paste the URL in your content:

```
Check out this article: https://example.com/article
```

**Markdown-style links:** Use `[text](url)` format in your content:

```
I found [this great article](https://example.com/article) about RSS.
```

Note: The HTML generator currently preserves these as plain text. If you need clickable links, you can:

1. Edit the JSON file and use HTML `<a>` tags in the content field
2. Manually edit the generated HTML in `output/posts/`

**Example with inline link:**

```json
{
  "content": "Check out <a href=\"https://example.com\">this article</a> for more."
}
```

#### Including Images

Images are not stored in posts directly. To include images:

1. **Host images externally** (GitHub, Imgur, your server)
2. **Reference in content** using HTML `<img>` tags:

   ```json
   {
     "content": "Here's a screenshot:\n\n<img src=\"https://example.com/image.png\" alt=\"Description\">\n\nWhat do you think?"
   }
   ```

3. The HTML generator will preserve the `<img>` tag
4. RSS readers that support HTML will display the image

**Important:** Always use `https://` URLs for images to ensure they work in RSS readers.

#### Content Formatting

The `content` field accepts:

- **Plain text** - Safest, works everywhere
- **HTML tags** - For links (`<a>`), images (`<img>`), emphasis (`<em>`, `<strong>`)
- **Line breaks** - Use `\n` for single break, `\n\n` for paragraphs

**Example with formatting:**

```json
{
  "content": "This is <strong>important</strong> text.\n\nThis is a new paragraph with a <a href=\"https://example.com\">link</a>.\n\n<img src=\"https://example.com/pic.jpg\" alt=\"Photo\">"
}
```

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

### Hosting on GitHub Pages

GitHub Pages is a free way to host your Beacon feed and posts. Here's a detailed guide:

#### Option 1: Using the docs/ Directory (Recommended)

1. **Create a docs directory** in your repository root:

   ```bash
   mkdir docs
   ```

2. **Copy your outputs to docs:**

   ```bash
   cp output/feed.rss docs/
   cp -r output/posts docs/
   ```

3. **Update your config** in `src/config.ts` to match your GitHub Pages URL:

   ```typescript
   export const DEFAULT_CONFIG: BeaconConfig = {
     feed: {
       title: 'My Beacon Feed',
       link: 'https://username.github.io/repository-name/feed.rss',
       description: 'Signal from The Beacon',
     },
     site: {
       baseUrl: 'https://username.github.io/repository-name',
     },
   };
   ```

4. **Commit and push:**

   ```bash
   git add docs/
   git commit -m "Add Beacon feed and posts"
   git push
   ```

5. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Click **Settings** → **Pages**
   - Under "Source", select **Deploy from a branch**
   - Choose **main** branch and **/docs** folder
   - Click **Save**

6. **Your feed will be live at:**
   - Feed: `https://username.github.io/repository-name/feed.rss`
   - Posts: `https://username.github.io/repository-name/posts/YYYY-MM-DD-slug.html`

#### Option 2: Using GitHub Actions (Automated)

Create `.github/workflows/publish.yml`:

```yaml
name: Publish Feed

on:
  push:
    paths:
      - 'posts/**'
      - 'src/**'

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build feed
        run: npm run build-feed
      
      - name: Copy to docs
        run: |
          mkdir -p docs
          cp output/feed.rss docs/
          cp -r output/posts docs/
      
      - name: Commit and push
        run: |
          git config user.name github-actions
          git config user.email github-actions@github.com
          git add docs/
          git commit -m "Auto-update feed" || exit 0
          git push
```

This automatically rebuilds and publishes when you add new posts.

#### Option 3: Using gh-pages Branch

1. **Install gh-pages package:**

   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add publish script to package.json:**

   ```json
   "scripts": {
     "publish-feed": "npm run build-feed && gh-pages -d output"
   }
   ```

3. **Publish:**

   ```bash
   npm run publish-feed
   ```

4. **Enable Pages** (choose gh-pages branch in Settings)

#### Tips for GitHub Pages

- **Custom domain:** Add a `CNAME` file to your docs/ directory
- **Index page:** Create `docs/index.html` to link to your posts
- **RSS autodiscovery:** Add this to your HTML head:

  ```html
  <link rel="alternate" type="application/rss+xml" title="My Feed" href="/feed.rss">
  ```

#### Workflow with GitHub Pages

1. Write a post: `npm run write`
2. Copy to docs: `cp output/feed.rss docs/ && cp -r output/posts docs/`
3. Commit: `git add docs/ && git commit -m "New post"`
4. Push: `git push`
5. Live in ~1 minute!

### Customizing Feed Metadata

Edit `src/config.ts` to customize your feed's metadata:

```typescript
export const DEFAULT_CONFIG: BeaconConfig = {
  feed: {
    title: 'My Beacon Feed',
    link: 'https://yourdomain.com/feed.rss',
    description: 'Signal from The Beacon',
  },
  site: {
    baseUrl: 'https://yourdomain.com',
  },
};
```

Replace `example.com` with your actual domain. This ensures:

- RSS feed has correct URLs
- Post links point to your site
- Feed metadata is accurate

**Important:** Update these values before publishing your feed!

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

Validate your feed at: <https://validator.w3.org/feed/>

---

**Remember:** Beacon is a tool, not a platform. You own your posts, you control your signal.
