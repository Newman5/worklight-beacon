
# 🧡 The Beacon  
## An RSS Reader for the Open Web Renaissance  
*A sidequest of [Worklight](https://github.com/your-worklight-link)*

> “Follow the signal. Shine your light.”

---

### 📖 Overview

**The Beacon** is a minimal, modern RSS feed reader built in TypeScript as part of the Worklight initiative. It reads an OPML file of RSS feed subscriptions, fetches and parses those feeds, and displays a reverse-chronological timeline in the terminal.

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

### ✅ What It Does (v0.1)

- ✅ Reads an `OPML` file (`subscriptions.opml`)
- ✅ Parses and extracts RSS feed URLs
- ✅ Fetches and parses each RSS feed (with fallback handling)
- ✅ Displays the latest posts (with limit per feed)
- ✅ Normalizes entries to a simple `FeedEntry` format
- ✅ Handles feeds without titles or metadata gracefully

---

### 🧱 Tech Stack (tentative)

- **Backend**: Node.js (feed fetcher + parser)
- **Parser**: `rss-parser` or `feedparser`
- **fast-xml-parser** – for reading OPML
- **Frontend**: CLI output for now (will add JSON/RSS export + web dashboard later)Astro (light UI for displaying the feed)
- **Storage**: In-memory or local JSON files (for now)

---

### 🧪 Getting Started

Install dependencies:
```bash
npm install
```
Run the CLI:
```bash
npx ts-node src/beacon.ts
```
Or use:
```bash
npm start
```
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


