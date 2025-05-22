import { AffirmationResponse } from '../models/affirmation.model';
import { AffirmationRequest } from '../models/affirmation-request.model';

export class AffirmationTestData {
  static readonly mockAffirmations: AffirmationResponse[] = [
    {
      id: 1,
      text: 'I am capable of achieving my goals',
      createdAt: '2024-01-01T10:00:00',
      updatedAt: '2024-01-01T10:00:00'
    },
    {
      id: 2,
      text: 'I believe in my abilities and talents',
      createdAt: '2024-01-02T11:00:00',
      updatedAt: '2024-01-02T11:00:00'
    },
    {
      id: 3,
      text: 'Every day I am becoming better and stronger',
      createdAt: '2024-01-03T12:00:00',
      updatedAt: '2024-01-03T12:00:00'
    }
  ];

  static readonly mockAffirmationRequest: AffirmationRequest = {
    text: 'I am confident and successful'
  };

  static readonly longTextAffirmation: AffirmationResponse = {
    id: 4,
    text: 'This is a very long affirmation text that exceeds the normal display length and should be truncated when displayed in the table to maintain a clean user interface and prevent layout issues',
    createdAt: '2024-01-04T13:00:00',
    updatedAt: '2024-01-04T13:00:00'
  };

  static createMockAffirmation(overrides: Partial<AffirmationResponse> = {}): AffirmationResponse {
    return {
      id: 1,
      text: 'Default mock affirmation',
      createdAt: '2024-01-01T10:00:00',
      updatedAt: '2024-01-01T10:00:00',
      ...overrides
    };
  }

  static createMockRequest(text: string = 'Default request text'): AffirmationRequest {
    return { text };
  }
}
