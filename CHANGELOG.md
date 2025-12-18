# Changelog

All notable changes to this project will be documented in this file.

This project follows [Semantic Versioning](https://semver.org/).

---

## [v1.0.0] - 2025-12-18

### Added - Write Mode 🎉
- ✨ **Write Mode**: Complete the RSS loop by creating your own posts
- 📝 Create posts via interactive CLI (`npm run write`)
- 💾 Posts stored as individual JSON files in `posts/` directory
- 📡 Automatic RSS 2.0 feed generation (`output/feed.rss`)
- 🌐 Static HTML page generation for each post (`output/posts/`)
- 🔗 Optional source URL linking to reference articles you're responding to
- 🛠️ Build command to regenerate all outputs (`npm run build-feed`)
- 📚 Comprehensive design documentation (`DESIGN_WRITE_MODE.md`)

### Features
- File-based storage (no database required)
- RSS 2.0 standard compliance
- Clean, minimal HTML output with responsive design
- Source attribution support for responding to other content
- Reverse-chronological post ordering

### Philosophy
- Files are truth
- RSS-first approach
- Local ownership and control
- Boring, durable technology
- Not a CMS, not a social network, just a tool

---

## [v0.1.0] - 2025-06-25

### Added
- 🎉 Initial release of **The Beacon**, a TypeScript RSS reader and Worklight sidequest
- Reads `subscriptions.opml` to discover RSS feed URLs
- Parses feeds using `rss-parser` and displays a clean terminal timeline
- Graceful fallback for feeds missing titles
- Fully written in TypeScript with modular structure

### Notes
- This is the foundational CLI version of The Beacon
- Built as an experiment in visibility, interop, and distributed contributor awareness
- Future updates will include `.json` and `.rss` exports, filters, and a web UI

---

