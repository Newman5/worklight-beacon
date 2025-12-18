
# 🧡 The Beacon  
## An RSS Reader for the Open Web Renaissance  
*A sidequest of [Worklight](https://github.com/your-worklight-link)*

> “Follow the signal. Shine your light.”
![The Beacon Hero Graphic](assets/Beacon-RSS.png)
---

### 📖 Overview

**The Beacon** is a minimal, modern RSS feed reader **and writer** built in TypeScript as part of the Worklight initiative. It completes the RSS loop: read feeds from others, write your own posts, and emit your signal back into the RSS ecosystem.

**Read:** Fetch and display RSS feeds from an OPML subscription list  
**Write:** Create posts that generate your own RSS feed

This project is a foundational step toward building interoperable, decentralized tools for contributor visibility and network awareness — starting with RSS.

---

### 🔦 Why Build This?

- RSS is one of the oldest, most resilient tools of the web.
- OPML is a universal way to share feed subscriptions (used by Dave Winer and others).
- Most modern collaboration happens in silos (Discord, Twitter, Slack).
- We believe contributors deserve a **clearer signal**.
- Worklight is about **surfacing signals** from contributors, across platforms.
- The Beacon helps us visualize work across protocols — beginning with RSS.
- This tool builds familiarity with the infrastructure of the open web.

---

### ✅ What It Does

#### Read Mode (v0.1)
- ✅ Reads an `OPML` file (`subscriptions.opml`)
- ✅ Parses and extracts RSS feed URLs
- ✅ Fetches and parses each RSS feed (with fallback handling)
- ✅ Displays the latest posts (with limit per feed)
- ✅ Normalizes entries to a simple `FeedEntry` format
- ✅ Handles feeds without titles or metadata gracefully

#### Write Mode (v1.0) ✨ NEW
- ✅ Create new posts via CLI
- ✅ Store posts as individual JSON files (`posts/`)
- ✅ Generate RSS 2.0 feed from your posts (`output/feed.rss`)
- ✅ Generate static HTML pages for each post (`output/posts/`)
- ✅ Optional source URL linking (reference articles you're responding to)
- ✅ File-based: no database, just files
- ✅ Durable: posts are plain JSON, easy to version control

---

### 🧱 Tech Stack

- **Runtime**: Node.js + TypeScript
- **RSS Reading**: `rss-parser`
- **OPML Parsing**: `fast-xml-parser`
- **RSS Writing**: Custom RSS 2.0 generator
- **CLI**: Built-in Node.js readline
- **Storage**: Local JSON files (no database)
- **Output**: RSS 2.0 XML

**New Dependencies Added:** None! Write mode uses only existing dependencies (chalk, dayjs) and built-in Node.js modules (fs, path, readline). New scripts added: `write` and `build-feed`.

---

### 🧪 Getting Started

Install dependencies:
```bash
npm install
```

#### Configure Your Feed (Important!)
Before creating posts, update `src/config.ts` to replace `example.com` with your actual domain:

```typescript
export const DEFAULT_CONFIG: BeaconConfig = {
  feed: {
    title: 'My Beacon Feed',           // Your feed name
    link: 'https://yourdomain.com/feed.rss',  // Your feed URL
    description: 'Signal from The Beacon',     // Feed description
  },
  site: {
    baseUrl: 'https://yourdomain.com',  // Your website URL
  },
};
```

#### Read RSS Feeds
Run the CLI to read your subscribed feeds:
```bash
npm start
```

#### Write a Post
Create a new post interactively:
```bash
npm run write
```

You'll be prompted for:
- **Title**: Your post title
- **Content**: Either type directly or provide a path to a text file
- **Source URL** (optional): URL you're responding to or referencing
- **Source Title** (optional): Title of the source

The post will be saved to `posts/` and your RSS feed will be regenerated at `output/feed.rss`. HTML pages are also generated at `output/posts/`.

#### Rebuild RSS Feed and HTML
If you manually edit post files, regenerate all outputs:
```bash
npm run build-feed
```

This will regenerate both the RSS feed and HTML pages.

#### File Structure
```
worklight-beacon/
├── subscriptions.opml     # Feeds you follow (read)
├── posts/                 # Posts you write
│   ├── YYYY-MM-DD-slug.json
│   └── ...
└── output/
    ├── feed.rss          # Your generated RSS feed
    └── posts/            # Generated HTML pages
        ├── YYYY-MM-DD-slug.html
        └── ...
```
---

### 📝 Example Workflow

1. **Read feeds** to discover interesting content:
   ```bash
   npm start
   ```

2. **Find something worth responding to** in the terminal output

3. **Write a post** referencing that content:
   ```bash
   npm run write
   ```
   
   Example:
   ```
   Title: Thoughts on the RSS Revival
   Content: I agree with the points made about RSS durability...
   Source URL: https://example.com/rss-article
   Source Title: The RSS Renaissance
   ```

4. **Your signal is emitted:**
   - Post saved: `posts/2025-06-26-thoughts-on-the-rss-revival.json`
   - RSS updated: `output/feed.rss`
   - HTML created: `output/posts/2025-06-26-thoughts-on-the-rss-revival.html`

5. **Share your feed** with others or host the HTML pages

**For detailed instructions, see [USER_GUIDE.md](USER_GUIDE.md)**

#### Quick: Hosting on GitHub Pages

To publish your feed for free on GitHub Pages:

1. **Copy outputs to docs directory:**
   ```bash
   mkdir -p docs
   cp output/feed.rss docs/
   cp -r output/posts docs/
   ```

2. **Update config** in `src/config.ts` with your GitHub Pages URL:
   ```typescript
   baseUrl: 'https://username.github.io/repo-name',
   ```

3. **Push and enable:** Commit, push, then enable GitHub Pages in Settings → Pages → Deploy from `/docs` folder

4. **Your feed is live!** Share `https://username.github.io/repo-name/feed.rss` with RSS readers

See [USER_GUIDE.md](USER_GUIDE.md#hosting-on-github-pages) for detailed GitHub Pages setup, automation options, and custom domains.

---

### 🎯 Design Philosophy

**Beacon completes the RSS loop:** read signal, emit signal.

#### What Beacon IS:
- ✅ A tool for reading and writing RSS
- ✅ File-based and durable
- ✅ Minimal and transparent
- ✅ Local-first (your files, your control)

#### What Beacon is NOT:
- ❌ Not a CMS or blog platform
- ❌ Not a social network
- ❌ Not a database-driven app
- ❌ Not a rich text editor
- ❌ Not an admin dashboard
- ❌ Not a plugin system

**Core Values:**
- **Files are truth** – JSON posts, RSS output, no hidden state
- **RSS-first** – Standard RSS 2.0, works with any reader
- **Boring tech** – No frameworks, no complex builds, just Node + TypeScript
- **Ownership** – You own your posts, your feed, your signal

See [DESIGN_WRITE_MODE.md](DESIGN_WRITE_MODE.md) for detailed design documentation.

---

### 🧠 Inspiration + Influence

- Dave Winer’s [WordLand](http://scripting.com/)
- RSS 2.0 and Atom
- IndieWeb, Scuttlebutt, ActivityPub
- Worklight project vision: presence, tension, attention, and signal aggregation

---

### 🌊 Visual Metaphor

> RSS is the **lighthouse** of the open web.  
> The Beacon listens, watches, and reveals.  
> Worklight is the ship — and the crew.

---

### 🫶 Want to Join In?

This is a small, low-barrier project to explore the open web together. If you want to:

- Tinker with RSS and OPML 
- Learn TypeScript in a real project 
- Build for the open web, not walled gardens 
- Visualize contributor activity in cool new ways... 

...then come aboard. 🌊 The Beacon is lit.

---

### License

MIT — Open to all.


