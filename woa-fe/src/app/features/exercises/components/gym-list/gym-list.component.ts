import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

import { GymService } from '../../services/gym.service';
import { GymResponse, GymSummary } from '../../models/gym.model';
import { GymRequest } from '../../models/gym-request.model';
import { GymDialogComponent } from '../gym-dialog/gym-dialog.component';
import { GymDetailsDialogComponent } from '../gym-details-dialog/gym-details-dialog.component';

@Component({
  selector: 'app-gym-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatChipsModule
  ],
  templateUrl: './gym-list.component.html',
  styleUrl: './gym-list.component.scss'
})
export class GymListComponent implements OnInit {
  gymExercises: GymResponse[] = [];
  displayedColumns: string[] = ['name', 'partOfBody', 'date', 'sets', 'maxWeight', 'actions'];
  loading = false;
  message = '';

  private readonly gymService = inject(GymService);
  private readonly dialog = inject(MatDialog);

  ngOnInit(): void {
    this.loadGymExercises();
  }

  loadGymExercises(): void {
    this.loading = true;
    this.message = '';

    this.gymService.getAllGymExercises().subscribe({
      next: (exercises) => {
        this.gymExercises = exercises;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading gym exercises:', error);
        this.message = 'Error loading gym exercises';
        this.loading = false;
      }
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(GymDialogComponent, {
      width: '600px',
      data: { isEdit: false }
    });

    dialogRef.afterClosed().subscribe((result: GymRequest) => {
      if (result) {
        this.createGymExercise(result);
      }
    });
  }

  openEditDialog(exercise: GymResponse): void {
    const dialogRef = this.dialog.open(GymDialogComponent, {
      width: '600px',
      data: { exercise, isEdit: true }
    });

    dialogRef.afterClosed().subscribe((result: GymRequest) => {
      if (result) {
        this.updateGymExercise(exercise.id, result);
      }
    });
  }

  openViewDialog(exercise: GymResponse): void {
    this.dialog.open(GymDetailsDialogComponent, {
      width: '700px',
      data: { exercise }
    });
  }

  createGymExercise(request: GymRequest): void {
    this.gymService.createGymExercise(request).subscribe({
      next: () => {
        this.message = 'Gym exercise created successfully';
        this.loadGymExercises();
        setTimeout(() => this.message = '', 3000);
      },
      error: (error) => {
        console.error('Error creating gym exercise:', error);
        this.message = 'Error creating gym exercise';
        setTimeout(() => this.message = '', 3000);
      }
    });
  }

  updateGymExercise(id: string, request: GymRequest): void {
    this.gymService.updateGymExercise(id, request).subscribe({
      next: () => {
        this.message = 'Gym exercise updated successfully';
        this.loadGymExercises();
        setTimeout(() => this.message = '', 3000);
      },
      error: (error) => {
        console.error('Error updating gym exercise:', error);
        this.message = 'Error updating gym exercise';
        setTimeout(() => this.message = '', 3000);
      }
    });
  }

  deleteGymExercise(id: string): void {
    if (confirm('Are you sure you want to delete this gym exercise?')) {
      this.gymService.deleteGymExercise(id).subscribe({
        next: () => {
          this.message = 'Gym exercise deleted successfully';
          this.loadGymExercises();
          setTimeout(() => this.message = '', 3000);
        },
        error: (error) => {
          console.error('Error deleting gym exercise:', error);
          this.message = 'Error deleting gym exercise';
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

  getTotalReps(exercise: GymResponse): number {
    return exercise.sets.reduce((total, set) => total + set.reps, 0);
  }

  getMaxWeight(exercise: GymResponse): number {
    return Math.max(...exercise.sets.map(set => set.weight));
  }

  getBodyPartColor(partOfBody: string): string {
    const colors: {[key: string]: string} = {
      'Chest': '#e3f2fd',
      'Back': '#f3e5f5',
      'Shoulders': '#fff3e0',
      'Arms': '#e8f5e8',
      'Legs': '#fce4ec',
      'Core': '#fff9c4',
      'Full Body': '#e0f2f1'
    };
    return colors[partOfBody] || '#f5f5f5';
  }
}
