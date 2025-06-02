import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { QuotationService } from './quotation.service';
import { QuotationResponse, QuotationSummary } from '../models/quotation.model';
import { QuotationRequest } from '../models/quotation-request.model';

describe('QuotationService', () => {
  let service: QuotationService;
  let httpMock: HttpTestingController;
  const API_URL = 'http://localhost:8081/api/quotations';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [QuotationService]
    });
    service = TestBed.inject(QuotationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all quotations', () => {
    const mockQuotations: QuotationResponse[] = [
      {
        id: 1,
        author: 'Albert Einstein',
        quotation: 'Imagination is more important than knowledge.',
        date: '1929-10-26',
        createdAt: '2024-01-01T10:00:00',
        updatedAt: '2024-01-01T10:00:00'
      }
    ];

    service.getAllQuotations().subscribe(quotations => {
      expect(quotations).toEqual(mockQuotations);
    });

    const req = httpMock.expectOne(`${API_URL}?sortBy=createdAt`);
    expect(req.request.method).toBe('GET');
    req.flush(mockQuotations);
  });

  it('should fetch quotation summaries', () => {
    const mockSummaries: QuotationSummary[] = [
      {
        id: 1,
        author: 'Albert Einstein',
        quotationPreview: 'Imagination is more important...',
        date: '1929-10-26'
      }
    ];

    service.getAllQuotationSummaries().subscribe(summaries => {
      expect(summaries).toEqual(mockSummaries);
    });

    const req = httpMock.expectOne(`${API_URL}/summary?sortBy=createdAt`);
    expect(req.request.method).toBe('GET');
    req.flush(mockSummaries);
  });

  it('should fetch quotation by id', () => {
    const mockQuotation: QuotationResponse = {
      id: 1,
      author: 'Albert Einstein',
      quotation: 'Imagination is more important than knowledge.',
      date: '1929-10-26',
      createdAt: '2024-01-01T10:00:00',
      updatedAt: '2024-01-01T10:00:00'
    };

    service.getQuotationById(1).subscribe(quotation => {
      expect(quotation).toEqual(mockQuotation);
    });

    const req = httpMock.expectOne(`${API_URL}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockQuotation);
  });

  it('should create a quotation', () => {
    const newQuotation: QuotationRequest = {
      author: 'Maya Angelou',
      quotation: 'You may not control all the events that happen to you.',
      date: '1969-04-04'
    };

    const createdQuotation: QuotationResponse = {
      id: 2,
      ...newQuotation,
      createdAt: '2024-01-01T10:00:00',
      updatedAt: '2024-01-01T10:00:00'
    };

    service.createQuotation(newQuotation).subscribe(quotation => {
      expect(quotation).toEqual(createdQuotation);
    });

    const req = httpMock.expectOne(API_URL);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newQuotation);
    req.flush(createdQuotation);
  });

  it('should update a quotation', () => {
    const quotationId = 1;
    const updateQuotation: QuotationRequest = {
      author: 'Albert Einstein',
      quotation: 'Updated quotation text.',
      date: '1929-10-26'
    };

    const updatedQuotation: QuotationResponse = {
      id: quotationId,
      ...updateQuotation,
      createdAt: '2024-01-01T10:00:00',
      updatedAt: '2024-01-01T11:00:00'
    };

    service.updateQuotation(quotationId, updateQuotation).subscribe(quotation => {
      expect(quotation).toEqual(updatedQuotation);
    });

    const req = httpMock.expectOne(`${API_URL}/${quotationId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updateQuotation);
    req.flush(updatedQuotation);
  });

  it('should delete a quotation', () => {
    const quotationId = 1;

    service.deleteQuotation(quotationId).subscribe();

    const req = httpMock.expectOne(`${API_URL}/${quotationId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
