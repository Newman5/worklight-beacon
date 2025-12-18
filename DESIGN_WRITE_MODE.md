# Beacon Write Mode Design

## Conceptual Design

**Core Principle:** Reading and writing are two sides of the same RSS coin.

Beacon's write-mode allows users to emit signal in response to what they read. It's not a CMS, blog engine, or social network—it's a tool to complete the RSS loop by letting users create their own feed items alongside the feeds they follow.

### Mental Model

```
Read:  OPML → Fetch Feeds → Display Timeline
Write: Create Post → Generate RSS Item → Emit to Personal Feed
```

Users read signals from others, then emit their own signal back into the RSS ecosystem.

## File and Data Layout

### Current Structure
```
worklight-beacon/
├── subscriptions.opml     # feeds they follow
├── output/
│   ├── latest.json       # (currently empty)
│   └── worklight.rss     # (currently empty)
└── src/                  # reader code
```

### Proposed Structure
```
worklight-beacon/
├── subscriptions.opml     # feeds they follow (READ)
├── posts/                 # posts they write (WRITE) ← NEW
│   ├── 2025-06-15-first-post.json
│   ├── 2025-06-20-link-share.json
│   └── 2025-06-25-response.json
├── output/                # generated outputs
│   ├── latest.json       # reader timeline (existing)
│   ├── feed.rss          # their authored RSS feed ← NEW
│   └── posts/            # optional HTML pages ← NEW
│       ├── 2025-06-15-first-post.html
│       └── ...
└── src/
    ├── beacon.ts         # main CLI (updated)
    ├── fetchFeeds.ts     # reader (existing)
    ├── parseOpml.ts      # reader (existing)
    ├── writePost.ts      # writer ← NEW
    └── generateFeed.ts   # RSS generator ← NEW
```

### Post File Format (JSON)

Posts are stored as individual JSON files in `posts/`:

```json
{
  "id": "2025-06-25-my-first-post",
  "title": "My First Beacon Post",
  "date": "2025-06-25T10:30:00Z",
  "content": "This is a short note about something I read.",
  "link": "https://example.com/my-post",
  "guid": "https://example.com/my-post",
  "sourceUrl": "https://somesite.com/article",
  "sourceTitle": "Article I'm responding to"
}
```

**Why JSON?**
- Human-readable and editable
- One file per post (durable, versioned)
- No database required
- Easy to backup, sync, version control

**Required fields:**
- `id` – unique identifier (filename-safe)
- `title` – post title
- `date` – ISO 8601 timestamp
- `content` – post body (plain text or simple markdown)

**Optional fields:**
- `link` – canonical URL (if published elsewhere)
- `guid` – RSS guid (defaults to link or id)
- `sourceUrl` – URL being referenced
- `sourceTitle` – title of source being referenced

## RSS Generation

The `output/feed.rss` file is regenerated from `posts/*.json` whenever:
1. A new post is created
2. User runs `npm run build-feed` (manual trigger)

RSS structure follows RSS 2.0 spec:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>My Beacon Feed</title>
    <link>https://example.com/feed.rss</link>
    <description>Signal from The Beacon</description>
    <lastBuildDate>Mon, 25 Jun 2025 10:30:00 GMT</lastBuildDate>
    
    <item>
      <title>My First Beacon Post</title>
      <link>https://example.com/my-post</link>
      <guid>https://example.com/my-post</guid>
      <pubDate>Mon, 25 Jun 2025 10:30:00 GMT</pubDate>
      <description><![CDATA[This is a short note...]]></description>
    </item>
  </channel>
</rss>
```

## Minimal UI Design

### Option 1: Command-Line Composer (Chosen)

```bash
# Create a new post interactively
npm run write

# Prompts:
> Title: My first post
> Content (or path to .txt/.md file): This is my post content
> Source URL (optional): https://example.com/article
> Publish? (y/n): y

✅ Post created: posts/2025-06-25-my-first-post.json
✅ RSS updated: output/feed.rss
```

**Why this approach?**
- Zero UI overhead
- Works in terminal (matches existing reader)
- Composable with unix tools
- Users can pre-write in their preferred editor

### Option 2: File-first approach (Alternative)

Users manually create `posts/draft.json`, then run:
```bash
npm run publish
```

This validates and moves the draft to a timestamped file.

## How Reading and Writing Connect

1. **Read feeds** → see interesting item
2. **Copy URL** from terminal output
3. **Write post** → reference that URL in `sourceUrl`
4. **RSS emitted** with link back to source

The connection is **lightweight and optional**:
- Not threaded replies
- Not comments
- Just: "I read X, here's my response"

## Architecture Flow

### Writing a Post

```
User input
  ↓
writePost.ts (create JSON file)
  ↓
posts/YYYY-MM-DD-slug.json
  ↓
generateFeed.ts (rebuild RSS)
  ↓
output/feed.rss
```

### Reading Posts (existing)

```
subscriptions.opml
  ↓
parseOpml.ts → fetchFeeds.ts
  ↓
Display in terminal
```

### Combined View (future enhancement)

```
npm run beacon --all

Shows:
- Feeds they follow (existing)
- Posts they've written (new, from posts/)
```

## Implementation Steps

### v0: Minimal Viable Write

**Goal:** Create one post, emit one RSS item

1. Create `posts/` directory
2. Create `src/writePost.ts` – CLI prompt for title, content
3. Create `src/generateFeed.ts` – scan `posts/*.json`, output RSS
4. Add `npm run write` script
5. Test: Create post → verify RSS output

**Time estimate:** 2-3 hours

### v1: Polish & Integration

**Goal:** Smooth workflow, optional HTML

1. Add source URL support (link to articles you're responding to)
2. Generate optional HTML pages in `output/posts/`
3. Add `npm run build` – regenerate all outputs
4. Update README with write-mode docs

**Time estimate:** 2-3 hours

### v2: Combined Timeline (future)

**Goal:** Unified view of read + write

1. Modify `beacon.ts` to also load local posts
2. Display interleaved timeline
3. Add markers to distinguish "read" vs "wrote"

**Time estimate:** 1-2 hours

## What Beacon Should NOT Do

❌ **No database** – files are the truth  
❌ **No admin panel** – just CLI and files  
❌ **No authentication** – local tool, local files  
❌ **No rich text editor** – plain text or simple markdown  
❌ **No comments system** – not a social network  
❌ **No federated protocol** – just RSS  
❌ **No automatic publishing** – user decides when to emit signal  
❌ **No post scheduling** – no complexity  
❌ **No analytics** – no tracking  

## Tradeoffs and Choices

### Choice: File-per-post vs Single JSON Array

**Chosen:** File-per-post

**Why:**
- ✅ Easier to version control (git diffs work well)
- ✅ Easier to edit manually
- ✅ Can be processed individually
- ✅ More durable (corruption affects one post, not all)

**Tradeoff:**
- Slightly slower to scan (need to read multiple files)
- Acceptable for hundreds of posts

### Choice: Plain Text vs Markdown

**Chosen:** Plain text in RSS, optional markdown for HTML

**Why:**
- RSS readers don't universally support markdown
- Keep RSS content simple and portable
- If generating HTML, can process markdown then

### Choice: Manual vs Automatic RSS Rebuild

**Chosen:** Automatic on `npm run write`, manual via `npm run build-feed`

**Why:**
- Convenient for normal workflow
- Still allows manual control
- RSS generation is fast (< 1s for hundreds of posts)

### Choice: HTML Generation

**Chosen:** Optional, off by default

**Why:**
- RSS is primary output
- HTML nice-to-have for web hosting
- Keeps core simple

## Configuration (future)

Eventually add `beacon.config.json`:

```json
{
  "feed": {
    "title": "My Beacon Feed",
    "link": "https://example.com/feed.rss",
    "description": "Signal from The Beacon",
    "author": "Your Name"
  },
  "output": {
    "rss": "output/feed.rss",
    "html": true,
    "htmlDir": "output/posts"
  }
}
```

For v0, hardcode sensible defaults.

## Summary

**What:** Add post creation + RSS generation to complete the RSS loop

**Where:** `posts/*.json` → `output/feed.rss`

**How:** CLI prompts → JSON files → RSS 2.0

**Why:** Let users emit signal in response to what they read

**Principle:** Files are truth, RSS is output, minimal UI, no platform thinking

This design respects the "boring, obvious solution" mandate while enabling Beacon users to participate fully in the RSS ecosystem—both reading and writing.
