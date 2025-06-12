import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { RunningResponse } from '../../models/running.model';

interface DialogData {
  exercise: RunningResponse;
}

@Component({
  selector: 'app-running-details-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  template: `
    <div class="running-details-container">
      <h2 mat-dialog-title>
        <mat-icon>directions_run</mat-icon>
        Running Session Details
      </h2>

      <mat-dialog-content>
        <mat-card class="detail-card">
          <h3>{{ formatDate(exercise.date) }}</h3>
          
          <div class="details-grid">
            <div class="detail-item">
              <mat-icon>straighten</mat-icon>
              <span class="label">Distance:</span>
              <span class="value">{{ exercise.distance }} km</span>
            </div>
            
            <div class="detail-item">
              <mat-icon>timer</mat-icon>
              <span class="label">Duration:</span>
              <span class="value">{{ formatDuration(exercise.time) }}</span>
            </div>
            
            <div class="detail-item">
              <mat-icon>speed</mat-icon>
              <span class="label">Average Speed:</span>
              <span class="value">{{ calculateAverageSpeed().toFixed(1) }} km/h</span>
            </div>
            
            <div class="detail-item">
              <mat-icon>timer</mat-icon>
              <span class="label">Pace:</span>
              <span class="value">{{ calculatePace() }} min/km</span>
            </div>
          </div>
        </mat-card>
      </mat-dialog-content>

      <mat-dialog-actions>
        <button mat-raised-button color="primary" (click)="onClose()">
          Close
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .running-details-container {
      width: 500px;
    }
    .detail-card {
      padding: 24px;
    }
    .details-grid {
      display: grid;
      gap: 16px;
      margin-top: 16px;
    }
    .detail-item {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .detail-item mat-icon {
      color: #666;
    }
    .label {
      font-weight: 500;
      min-width: 120px;
    }
    .value {
      font-weight: 600;
      color: #2c3e50;
    }
    h2, h3 {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  `]
})
export class RunningDetailsDialogComponent {
  exercise: RunningResponse;

  constructor(
    private dialogRef: MatDialogRef<RunningDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: DialogData
  ) {
    this.exercise = data.exercise;
  }

  onClose(): void {
    this.dialogRef.close();
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatDuration(durationString: string): string {
    if (!durationString) return '';
    
    const match = durationString.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?/);
    if (!match) return durationString;

    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    const seconds = parseFloat(match[3] || '0');

    if (hours > 0) {
      return `${hours}h ${minutes}m ${Math.floor(seconds)}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${Math.floor(seconds)}s`;
    } else {
      return `${Math.floor(seconds)}s`;
    }
  }

  calculateAverageSpeed(): number {
    if (!this.exercise.time || !this.exercise.distance) return 0;
    
    const match = this.exercise.time.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?/);
    if (!match) return 0;

    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    const seconds = parseFloat(match[3] || '0');
    
    const totalHours = hours + minutes / 60 + seconds / 3600;
    if (totalHours === 0) return 0;
    
    return this.exercise.distance / totalHours;
  }

  calculatePace(): string {
    if (!this.exercise.time || !this.exercise.distance) return '0:00';
    
    const match = this.exercise.time.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?/);
    if (!match) return '0:00';

    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    const seconds = parseFloat(match[3] || '0');
    
    const totalMinutes = hours * 60 + minutes + seconds / 60;
    if (this.exercise.distance === 0) return '0:00';
    
    const paceMinutes = totalMinutes / this.exercise.distance;
    const paceMin = Math.floor(paceMinutes);
    const paceSec = Math.floor((paceMinutes - paceMin) * 60);
    
    return `${paceMin}:${paceSec.toString().padStart(2, '0')}`;
  }
}
