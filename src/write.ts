import { createPost, savePost } from './writePost';
import { buildFeed } from './generateFeed';
import { generateHtmlPages } from './generateHtml';
import chalk from 'chalk';

async function main() {
  try {
    const post = await createPost();

    console.log('\n📋 Post preview:');
    console.log(chalk.bold(`   Title: ${post.title}`));
    console.log(`   Date: ${post.date}`);
    console.log(`   Content: ${post.content.substring(0, 100)}${post.content.length > 100 ? '...' : ''}`);
    if (post.sourceUrl) {
      console.log(`   Source: ${post.sourceUrl}`);
    }

    console.log('\n');
    
    // For non-interactive environments, auto-confirm
    // In interactive mode, could add a confirmation prompt
    const filepath = savePost(post);
    console.log(chalk.green(`✅ Post saved: ${filepath}`));

    // Rebuild RSS feed
    buildFeed();
    
    // Generate HTML page for the post
    generateHtmlPages([post]);
    
    console.log(chalk.bold.hex('#FFA500')('\n🧡 Post published! Your signal is emitted.\n'));
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error(chalk.red(`❌ Error: ${err.message}`));
    process.exit(1);
  }
}

main();
