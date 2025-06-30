import { parseOpml } from './parseOpml';
import { fetchFeeds } from './fetchFeeds';
import chalk from 'chalk';

async function main() {
  const urls = parseOpml('subscriptions.opml');
  console.log(`📡 Found ${urls.length} feed(s). Fetching...\n`);

  const entries = await fetchFeeds(urls, 5);
  const latest = entries.slice(0, 10); // display latest 10 posts

for (const entry of latest) {
  console.log(chalk.bold.hex('#FFA500')(`🧡 ${entry.title}`));
  console.log(`   🔗 ${chalk.underline.blue(entry.link)}`);
  console.log(`   🕓 ${chalk.gray(entry.pubDate)}`);
  console.log(`   🗂️  Source: ${chalk.green(entry.source)}\n`);
}
}

main();
console.log(`📡 Found some entries. bye...\n`);