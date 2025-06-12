export interface RunningResponse {
  id: string;
  distance: number;
  time: string; // ISO 8601 Duration format
  date: string;
}

export interface RunningSummary {
  id: string;
  distance: number;
  time: string;
  date: string;
  averageSpeed: number;
}
