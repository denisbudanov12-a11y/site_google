export interface SearchQueryAnalysis {
  id: string;
  query: string;
  intentType: 'Транзакционный' | 'Коммерческий' | 'Локальный' | 'Срочный';
  temperature: number; // 0 to 100
  avgCpcEstimate: string;
  expectedCr: string;
  buyerMindset: string;
  mustHaveOnPage: string[];
  fatalMistake: string;
}

export interface BusinessNiche {
  id: string;
  name: string;
  defaultAvgCheck: number; // in USD or equivalent
  defaultMonthlySearches: number;
  typicalColdCr: number; // in %
  typicalSearchCr: number; // in %
  currency: string;
}

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  weight: number;
  whyCrucial: string;
}

export interface CaseStudy {
  id: string;
  industry: string;
  client: string;
  duration: string;
  before: {
    channel: string;
    cpa: string;
    monthlyRevenue: string;
    leadQuality: string;
  };
  after: {
    channel: string;
    cpa: string;
    monthlyRevenue: string;
    roi: string;
  };
  strategy: string[];
  quote: string;
  author: string;
  authorRole: string;
}

export interface ClientQuote {
  id: string;
  name: string;
  role: string;
  company: string;
  avatarText: string;
  rating: number;
  highlightMetric: string;
  quote: string;
  niche: string;
}
