import Parser from 'rss-parser';

export interface FeedEntry {
  title: string;
  link: string;
  pubDate: string;
  source: string;
}

const parser = new Parser();

export async function fetchFeeds(
  urls: string[],
  limitPerFeed = 5
): Promise<FeedEntry[]> {
  const allEntries: FeedEntry[] = [];

  for (const url of urls) {
    try {
      const feed = await parser.parseURL(url);
      const entries = (feed.items || []).slice(0, limitPerFeed).map((item) => ({
        title: item.title || 'Untitled',
        link: item.link || '',
        pubDate: item.pubDate || '',
        source: feed.title || url,
      }));
      allEntries.push(...entries);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      console.error(`❌ Failed to fetch ${url}:`, error.message);
    }
  }

  return allEntries.sort(
    (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  );
}
