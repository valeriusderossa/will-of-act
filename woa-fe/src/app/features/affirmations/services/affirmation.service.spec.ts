import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AffirmationService } from './affirmation.service';
import { AffirmationResponse, AffirmationSummary } from '../models/affirmation.model';
import { AffirmationRequest } from '../models/affirmation-request.model';

describe('AffirmationService', () => {
  let service: AffirmationService;
  let httpMock: HttpTestingController;
  const API_URL = 'http://localhost:8081/api/affirmations';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AffirmationService]
    });
    service = TestBed.inject(AffirmationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllAffirmations', () => {
    it('should return affirmations array', () => {
      const mockAffirmations: AffirmationResponse[] = [
        { id: 1, text: 'Test affirmation 1', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
        { id: 2, text: 'Test affirmation 2', createdAt: '2024-01-02', updatedAt: '2024-01-02' }
      ];

      service.getAllAffirmations().subscribe(affirmations => {
        expect(affirmations).toEqual(mockAffirmations);
        expect(affirmations.length).toBe(2);
      });

      const req = httpMock.expectOne(API_URL);
      expect(req.request.method).toBe('GET');
      req.flush(mockAffirmations);
    });
  });

  describe('getAllAffirmationSummaries', () => {
    it('should return affirmation summaries array', () => {
      const mockSummaries: AffirmationSummary[] = [
        { id: 1, text: 'Summary 1', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
        { id: 2, text: 'Summary 2', createdAt: '2024-01-02', updatedAt: '2024-01-02' }
      ];

      service.getAllAffirmationSummaries().subscribe(summaries => {
        expect(summaries).toEqual(mockSummaries);
      });

      const req = httpMock.expectOne(`${API_URL}/summaries`);
      expect(req.request.method).toBe('GET');
      req.flush(mockSummaries);
    });
  });

  describe('getAffirmationById', () => {
    it('should return affirmation by id', () => {
      const mockAffirmation: AffirmationResponse = {
        id: 1,
        text: 'Test affirmation',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      };

      service.getAffirmationById(1).subscribe(affirmation => {
        expect(affirmation).toEqual(mockAffirmation);
      });

      const req = httpMock.expectOne(`${API_URL}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockAffirmation);
    });
  });

  describe('createAffirmation', () => {
    it('should create new affirmation', () => {
      const request: AffirmationRequest = { text: 'New affirmation' };
      const mockResponse: AffirmationResponse = {
        id: 1,
        text: 'New affirmation',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      };

      service.createAffirmation(request).subscribe(affirmation => {
        expect(affirmation).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(API_URL);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(request);
      req.flush(mockResponse);
    });
  });

  describe('updateAffirmation', () => {
    it('should update existing affirmation', () => {
      const request: AffirmationRequest = { text: 'Updated affirmation' };
      const mockResponse: AffirmationResponse = {
        id: 1,
        text: 'Updated affirmation',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      };

      service.updateAffirmation(1, request).subscribe(affirmation => {
        expect(affirmation).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${API_URL}/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(request);
      req.flush(mockResponse);
    });
  });

  describe('deleteAffirmation', () => {
    it('should delete affirmation', () => {
      service.deleteAffirmation(1).subscribe(response => {
        expect(response).toBeUndefined();
      });

      const req = httpMock.expectOne(`${API_URL}/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });
});
