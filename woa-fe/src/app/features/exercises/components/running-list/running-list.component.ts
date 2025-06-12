import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';

import { RunningService } from '../../services/running.service';
import { RunningResponse, RunningSummary } from '../../models/running.model';
import { RunningRequest } from '../../models/running-request.model';
import { RunningDialogComponent } from '../running-dialog/running-dialog.component';
import { RunningDetailsDialogComponent } from '../running-details-dialog/running-details-dialog.component';

@Component({
  selector: 'app-running-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatCardModule
  ],
  templateUrl: './running-list.component.html',
  styleUrl: './running-list.component.scss'
})
export class RunningListComponent implements OnInit {
  runningExercises: RunningResponse[] = [];
  displayedColumns: string[] = ['date', 'distance', 'time', 'averageSpeed', 'actions'];
  loading = false;
  message = '';

  private readonly runningService = inject(RunningService);
  private readonly dialog = inject(MatDialog);

  ngOnInit(): void {
    this.loadRunningExercises();
  }

  loadRunningExercises(): void {
    this.loading = true;
    this.message = '';

    this.runningService.getAllRunningExercises().subscribe({
      next: (exercises) => {
        this.runningExercises = exercises;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading running exercises:', error);
        this.message = 'Error loading running exercises';
        this.loading = false;
      }
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(RunningDialogComponent, {
      width: '500px',
      data: { isEdit: false }
    });

    dialogRef.afterClosed().subscribe((result: RunningRequest) => {
      if (result) {
        this.createRunningExercise(result);
      }
    });
  }

  openEditDialog(exercise: RunningResponse): void {
    const dialogRef = this.dialog.open(RunningDialogComponent, {
      width: '500px',
      data: { exercise, isEdit: true }
    });

    dialogRef.afterClosed().subscribe((result: RunningRequest) => {
      if (result) {
        this.updateRunningExercise(exercise.id, result);
      }
    });
  }

  openViewDialog(exercise: RunningResponse): void {
    this.dialog.open(RunningDetailsDialogComponent, {
      width: '600px',
      data: { exercise }
    });
  }

  createRunningExercise(request: RunningRequest): void {
    this.runningService.createRunningExercise(request).subscribe({
      next: () => {
        this.message = 'Running exercise created successfully';
        this.loadRunningExercises();
        setTimeout(() => this.message = '', 3000);
      },
      error: (error) => {
        console.error('Error creating running exercise:', error);
        this.message = 'Error creating running exercise';
        setTimeout(() => this.message = '', 3000);
      }
    });
  }

  updateRunningExercise(id: string, request: RunningRequest): void {
    this.runningService.updateRunningExercise(id, request).subscribe({
      next: () => {
        this.message = 'Running exercise updated successfully';
        this.loadRunningExercises();
        setTimeout(() => this.message = '', 3000);
      },
      error: (error) => {
        console.error('Error updating running exercise:', error);
        this.message = 'Error updating running exercise';
        setTimeout(() => this.message = '', 3000);
      }
    });
  }

  deleteRunningExercise(id: string): void {
    if (confirm('Are you sure you want to delete this running exercise?')) {
      this.runningService.deleteRunningExercise(id).subscribe({
        next: () => {
          this.message = 'Running exercise deleted successfully';
          this.loadRunningExercises();
          setTimeout(() => this.message = '', 3000);
        },
        error: (error) => {
          console.error('Error deleting running exercise:', error);
          this.message = 'Error deleting running exercise';
          setTimeout(() => this.message = '', 3000);
        }
      });
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  formatDuration(durationString: string): string {
    if (!durationString) return '';

    // Parse ISO 8601 duration (PT25M30S)
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

  calculateAverageSpeed(exercise: RunningResponse): number {
    if (!exercise.time || !exercise.distance) return 0;

    // Parse duration to get total minutes
    const match = exercise.time.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?/);
    if (!match) return 0;

    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    const seconds = parseFloat(match[3] || '0');

    const totalMinutes = hours * 60 + minutes + seconds / 60;
    if (totalMinutes === 0) return 0;

    return (exercise.distance / totalMinutes) * 60; // km/h
  }

  getSpeedColor(speed: number): string {
    if (speed >= 15) return '#4caf50'; // Green for fast
    if (speed >= 10) return '#ff9800'; // Orange for moderate
    return '#f44336'; // Red for slow
  }
}
