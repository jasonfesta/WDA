export interface UpdateItem {
  id: string;
  tag: string;
  title: string;
  excerpt: string;
  content: string;
  status: 'Scheduled' | 'Draft' | 'In review' | 'Published';
  scheduledDate: string;
  scheduledTime: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  reviewer: {
    name: string;
    avatar: string;
    status: string;
  };
  category: 'Product improvement' | 'Feature' | 'Performance' | 'Infrastructure';
  channels: {
    publicChangelog: boolean;
    customerEmail: boolean;
    inAppBanner: boolean;
  };
  stats?: {
    views?: string;
    openRate?: string;
    subscribers?: string;
  };
}

export const INITIAL_UPDATES: UpdateItem[] = [
  {
    id: 'upd_072',
    tag: 'upd_072',
    title: 'A faster way to find your work',
    excerpt: 'Search across saved views and recent projects in one place.',
    content: 'We redesigned global search with millisecond index queries, multi-filter syntax, and context-aware shortcuts. Navigate across deep documentation, issue trees, and team changelog releases without breaking flow state.',
    status: 'Scheduled',
    scheduledDate: '28 Oct 2026',
    scheduledTime: '09:00 UTC',
    author: {
      name: 'Nina Cole',
      avatar: 'NC',
      role: 'Staff Product Designer'
    },
    reviewer: {
      name: 'Sam Lee',
      avatar: 'SL',
      status: 'Approved'
    },
    category: 'Product improvement',
    channels: {
      publicChangelog: true,
      customerEmail: true,
      inAppBanner: true
    },
    stats: {
      views: '14.2k recipients',
      openRate: '68.4% projected',
      subscribers: 'Mica Core'
    }
  },
  {
    id: 'upd_071',
    tag: 'upd_071',
    title: 'Shared views for every team',
    excerpt: 'Pin dynamic milestone filters and curate workspace visibility.',
    content: 'Create shared perspectives that sync directly across engineering squads, customer success, and executive circles. Configure custom access boundaries or broadcast live release notes automatically.',
    status: 'Draft',
    scheduledDate: '04 Nov 2026',
    scheduledTime: '15:30 UTC',
    author: {
      name: 'Marcus Vance',
      avatar: 'MV',
      role: 'Lead Systems Architect'
    },
    reviewer: {
      name: 'Nina Cole',
      avatar: 'NC',
      status: 'Pending changes'
    },
    category: 'Feature',
    channels: {
      publicChangelog: true,
      customerEmail: false,
      inAppBanner: true
    }
  },
  {
    id: 'upd_070',
    tag: 'upd_070',
    title: 'More control over exports',
    excerpt: 'Deliver markdown summaries, static HTML snapshots, and signed JSON payloads.',
    content: 'Extract verified changelog records in immutable, signed markdown and clean RSS/JSON formats. Integrate effortlessly with downstream documentation portals and compliance logs.',
    status: 'In review',
    scheduledDate: '12 Nov 2026',
    scheduledTime: '18:00 UTC',
    author: {
      name: 'Elena Rostova',
      avatar: 'ER',
      role: 'Head of Infrastructure'
    },
    reviewer: {
      name: 'Sam Lee',
      avatar: 'SL',
      status: 'In discussion'
    },
    category: 'Performance',
    channels: {
      publicChangelog: true,
      customerEmail: true,
      inAppBanner: false
    }
  }
];
