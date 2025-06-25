import fs from 'fs';
import { XMLParser } from 'fast-xml-parser';

export function parseOpml(filePath: string): string[] {
  const xml = fs.readFileSync(filePath, 'utf-8');
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '',
  });

  const parsed = parser.parse(xml);
  const outlines = parsed.opml.body.outline;
  const feedUrls: string[] = [];

  function collectFeeds(nodes: any[]) {
    for (const node of nodes) {
      if (node.xmlUrl) {
        feedUrls.push(node.xmlUrl);
      }
      if (Array.isArray(node.outline)) {
        collectFeeds(node.outline);
      } else if (node.outline) {
        collectFeeds([node.outline]);
      }
    }
  }

  collectFeeds(Array.isArray(outlines) ? outlines : [outlines]);
  return feedUrls;
}
