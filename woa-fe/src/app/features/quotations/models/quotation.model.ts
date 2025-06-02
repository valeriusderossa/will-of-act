export interface QuotationResponse {
  id: number;
  author: string;
  quotation: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuotationSummary {
  id: number;
  author: string;
  quotationPreview: string;
  date: string;
}
