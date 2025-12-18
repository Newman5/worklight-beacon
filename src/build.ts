import { buildFeed } from './generateFeed';
import { generateHtmlPages } from './generateHtml';

console.log('🔨 Building all outputs...\n');

buildFeed();
generateHtmlPages();

console.log('\n✨ Build complete!');

