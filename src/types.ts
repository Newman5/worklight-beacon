export interface Post {
  id: string;
  title: string;
  date: string; // ISO 8601
  content: string;
  link?: string;
  guid?: string;
  sourceUrl?: string;
  sourceTitle?: string;
}

export interface FeedEntry {
  title: string;
  link: string;
  pubDate: string;
  source: string;
}
