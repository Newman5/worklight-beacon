export interface BeaconConfig {
  feed: {
    title: string;
    link: string;
    description: string;
    author?: string;
  };
  site: {
    baseUrl: string;
  };
}

// Default configuration
export const DEFAULT_CONFIG: BeaconConfig = {
  feed: {
    title: 'My Beacon Feed',
    link: 'https://example.com/feed.rss',
    description: 'Signal from The Beacon',
  },
  site: {
    baseUrl: 'https://example.com',
  },
};

// Load configuration from file if it exists, otherwise use defaults
export function loadConfig(): BeaconConfig {
  // For now, return defaults. In the future, this could read from beacon.config.json
  return DEFAULT_CONFIG;
}
