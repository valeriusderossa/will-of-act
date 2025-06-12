import { SetEntry } from './set-entry.model';

export interface GymResponse {
  id: string;
  name: string;
  partOfBody: string;
  date: string;
  sets: SetEntry[];
}

export interface GymSummary {
  id: string;
  name: string;
  partOfBody: string;
  date: string;
  totalSets: number;
  totalReps: number;
  maxWeight: number;
  avgWeight: number;
}
