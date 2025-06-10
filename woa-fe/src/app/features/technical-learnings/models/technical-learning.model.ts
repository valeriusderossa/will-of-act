export interface TechnicalLearningResponse {
  id: number;
  language: string;
  subject: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}

export interface TechnicalLearningSummary {
  id: number;
  language: string;
  subject: string;
  textPreview: string;
  createdAt: string;
}
