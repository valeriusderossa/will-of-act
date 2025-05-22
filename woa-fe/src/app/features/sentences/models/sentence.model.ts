export interface SentenceResponse {
  id: number;
  englishText: string;
  polishText: string;
  pronunciation?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SentenceSummary {
  id: number;
  englishText: string;
  polishText: string;
  createdAt: string;
}
