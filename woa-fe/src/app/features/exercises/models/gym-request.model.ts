import { SetEntry } from './set-entry.model';

export interface GymRequest {
  name: string;
  partOfBody: string;
  date: string;
  sets: SetEntry[];
}
