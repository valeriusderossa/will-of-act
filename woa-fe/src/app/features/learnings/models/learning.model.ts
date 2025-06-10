export interface LearningResponse {
  id: number;
  language: string;
  subject: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}

export interface LearningSummary {
  id: number;
  language: string;
  subject: string;
  textPreview: string;
  createdAt: string;
}
