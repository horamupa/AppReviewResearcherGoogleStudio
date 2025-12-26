export interface Feature {
  title: string;
  description: string;
}

export interface AppAnalysisResult {
  appName: string;
  likedFeatures: Feature[];
  dislikedFeatures: Feature[];
  competitorPrdMarkdown: string;
}

export enum TabOption {
  LIKED = 'LIKED',
  DISLIKED = 'DISLIKED',
  PRD = 'PRD'
}

export interface AnalysisState {
  isLoading: boolean;
  error: string | null;
  result: AppAnalysisResult | null;
}
