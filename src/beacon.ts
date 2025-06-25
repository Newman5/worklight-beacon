import { parseOpml } from './parseOpml';
import { fetchFeeds } from './fetchFeeds';

async function main() {
  const urls = parseOpml('subscriptions.opml');
  console.log(`📡 Found ${urls.length} feed(s). Fetching...\n`);

  const entries = await fetchFeeds(urls, 5);
  const latest = entries.slice(0, 10); // display latest 10 posts

  for (const entry of latest) {
    console.log(`🧡 ${entry.title}`);
    console.log(`   🔗 ${entry.link}`);
    console.log(`   🕓 ${entry.pubDate}`);
    console.log(`   🗂️  Source: ${entry.source}\n`);
  }
}

main();
