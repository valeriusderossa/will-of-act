import { QuotationResponse, QuotationSummary, QuotationRequest } from '../index';

export class QuotationTestData {
  static readonly SAMPLE_QUOTATIONS: QuotationResponse[] = [
    {
      id: 1,
      author: 'Albert Einstein',
      quotation: 'Imagination is more important than knowledge. For knowledge is limited, whereas imagination embraces the entire world, stimulating progress, giving birth to evolution.',
      date: '1929-10-26',
      createdAt: '2024-01-01T10:00:00',
      updatedAt: '2024-01-01T10:00:00'
    },
    {
      id: 2,
      author: 'Maya Angelou',
      quotation: 'I\'ve learned that people will forget what you said, people will forget what you did, but people will never forget how you made them feel.',
      date: '1969-04-04',
      createdAt: '2024-01-02T10:00:00',
      updatedAt: '2024-01-02T10:00:00'
    },
    {
      id: 3,
      author: 'Nelson Mandela',
      quotation: 'Education is the most powerful weapon which you can use to change the world.',
      date: '1990-02-11',
      createdAt: '2024-01-03T10:00:00',
      updatedAt: '2024-01-03T10:00:00'
    },
    {
      id: 4,
      author: 'Steve Jobs',
      quotation: 'Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work.',
      date: '2005-06-12',
      createdAt: '2024-01-04T10:00:00',
      updatedAt: '2024-01-04T10:00:00'
    },
    {
      id: 5,
      author: 'Martin Luther King Jr.',
      quotation: 'Darkness cannot drive out darkness; only light can do that. Hate cannot drive out hate; only love can do that.',
      date: '1963-08-28',
      createdAt: '2024-01-05T10:00:00',
      updatedAt: '2024-01-05T10:00:00'
    }
  ];

  static readonly SAMPLE_QUOTATION_SUMMARIES: QuotationSummary[] = [
    {
      id: 1,
      author: 'Albert Einstein',
      quotationPreview: 'Imagination is more important than knowledge. For knowledge is limited, whereas imagination...',
      date: '1929-10-26'
    },
    {
      id: 2,
      author: 'Maya Angelou',
      quotationPreview: 'I\'ve learned that people will forget what you said, people will forget what you did, but...',
      date: '1969-04-04'
    },
    {
      id: 3,
      author: 'Nelson Mandela',
      quotationPreview: 'Education is the most powerful weapon which you can use to change the world.',
      date: '1990-02-11'
    },
    {
      id: 4,
      author: 'Steve Jobs',
      quotationPreview: 'Your work is going to fill a large part of your life, and the only way to be truly satisfied...',
      date: '2005-06-12'
    },
    {
      id: 5,
      author: 'Martin Luther King Jr.',
      quotationPreview: 'Darkness cannot drive out darkness; only light can do that. Hate cannot drive out hate; only...',
      date: '1963-08-28'
    }
  ];

  static readonly SAMPLE_QUOTATION_REQUESTS: QuotationRequest[] = [
    {
      author: 'Winston Churchill',
      quotation: 'Success is not final, failure is not fatal: it is the courage to continue that counts.',
      date: '1942-11-10'
    },
    {
      author: 'Mark Twain',
      quotation: 'The two most important days in your life are the day you are born and the day you find out why.',
      date: '1894-05-15'
    },
    {
      author: 'Oscar Wilde',
      quotation: 'Be yourself; everyone else is already taken.',
      date: '1891-03-20'
    }
  ];

  static getQuotationById(id: number): QuotationResponse | undefined {
    return this.SAMPLE_QUOTATIONS.find(q => q.id === id);
  }

  static getQuotationsByAuthor(author: string): QuotationResponse[] {
    return this.SAMPLE_QUOTATIONS.filter(q =>
      q.author.toLowerCase().includes(author.toLowerCase())
    );
  }

  static searchQuotations(searchText: string): QuotationResponse[] {
    const lowerSearchText = searchText.toLowerCase();
    return this.SAMPLE_QUOTATIONS.filter(q =>
      q.author.toLowerCase().includes(lowerSearchText) ||
      q.quotation.toLowerCase().includes(lowerSearchText)
    );
  }

  static getQuotationsByDateRange(startDate: string, endDate: string): QuotationResponse[] {
    return this.SAMPLE_QUOTATIONS.filter(q =>
      q.date >= startDate && q.date <= endDate
    );
  }

  static createMockQuotation(overrides?: Partial<QuotationResponse>): QuotationResponse {
    return {
      id: Math.floor(Math.random() * 1000),
      author: 'Test Author',
      quotation: 'This is a test quotation for testing purposes only.',
      date: '2024-01-01',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...overrides
    };
  }

  static createMockQuotationRequest(overrides?: Partial<QuotationRequest>): QuotationRequest {
    return {
      author: 'Test Author',
      quotation: 'This is a test quotation for testing purposes only.',
      date: '2024-01-01',
      ...overrides
    };
  }

  static createMockQuotationSummary(overrides?: Partial<QuotationSummary>): QuotationSummary {
    return {
      id: Math.floor(Math.random() * 1000),
      author: 'Test Author',
      quotationPreview: 'This is a test quotation for testing...',
      date: '2024-01-01',
      ...overrides
    };
  }

  static getRandomQuotation(): QuotationResponse {
    const randomIndex = Math.floor(Math.random() * this.SAMPLE_QUOTATIONS.length);
    return this.SAMPLE_QUOTATIONS[randomIndex];
  }

  static getUniqueAuthors(): string[] {
    return [...new Set(this.SAMPLE_QUOTATIONS.map(q => q.author))].sort();
  }

  static getQuotationsFromYear(year: number): QuotationResponse[] {
    return this.SAMPLE_QUOTATIONS.filter(q =>
      new Date(q.date).getFullYear() === year
    );
  }
}
