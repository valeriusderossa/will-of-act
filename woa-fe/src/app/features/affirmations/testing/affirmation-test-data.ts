import { AffirmationResponse, AffirmationRequest } from '../index';

export const mockAffirmationResponses: AffirmationResponse[] = [
  {
    id: 1,
    text: 'I am confident and capable of achieving my goals.',
    createdAt: '2024-01-15T10:30:00',
    updatedAt: '2024-01-15T10:30:00'
  },
  {
    id: 2,
    text: 'Every day, I grow stronger and more resilient.',
    createdAt: '2024-01-16T09:15:00',
    updatedAt: '2024-01-16T09:15:00'
  },
  {
    id: 3,
    text: 'I attract positive energy and meaningful connections.',
    createdAt: '2024-01-17T14:20:00',
    updatedAt: '2024-01-17T14:20:00'
  },
  {
    id: 4,
    text: 'I deserve success and happiness in all areas of my life.',
    createdAt: '2024-01-18T08:45:00',
    updatedAt: '2024-01-18T08:45:00'
  },
  {
    id: 5,
    text: 'I trust in my ability to overcome any challenge.',
    createdAt: '2024-01-19T16:10:00',
    updatedAt: '2024-01-19T16:10:00'
  }
];

export const mockAffirmationRequests: AffirmationRequest[] = [
  {
    text: 'I am worthy of love and respect.'
  },
  {
    text: 'I embrace change as an opportunity for growth.'
  },
  {
    text: 'My potential is limitless.'
  }
];
