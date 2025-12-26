export interface Feature {
  title: string;
  description: string;
}

export interface Review {
  author: string;
  rating: number;
  title?: string;
  content: string;
}

export interface AppAnalysisResult {
  appName: string;
  likedFeatures: Feature[];
  dislikedFeatures: Feature[];
  reviews: Review[];
  competitorPrdMarkdown: string;
  prdRulesMarkdown: string;
}

export enum TabOption {
  LIKED = 'LIKED',
  DISLIKED = 'DISLIKED',
  REVIEWS = 'REVIEWS',
  PRD = 'PRD',
  PRD_RULES = 'PRD_RULES'
}

export interface AnalysisState {
  isLoading: boolean;
  error: string | null;
  result: AppAnalysisResult | null;
}
