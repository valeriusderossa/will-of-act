import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';

import { GymResponse } from '../../models/gym.model';

interface DialogData {
  exercise: GymResponse;
}

@Component({
  selector: 'app-gym-details-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatDividerModule
  ],
  templateUrl: './gym-details-dialog.component.html',
  styleUrl: './gym-details-dialog.component.scss'
})
export class GymDetailsDialogComponent {
  exercise: GymResponse;

  constructor(
    private dialogRef: MatDialogRef<GymDetailsDialogComponent>,
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

  getTotalReps(): number {
    return this.exercise.sets.reduce((total, set) => total + set.reps, 0);
  }

  getTotalWeight(): number {
    return this.exercise.sets.reduce((total, set) => total + (set.reps * set.weight), 0);
  }

  getMaxWeight(): number {
    return Math.max(...this.exercise.sets.map(set => set.weight));
  }

  getAverageWeight(): number {
    if (this.exercise.sets.length === 0) return 0;
    const totalWeight = this.exercise.sets.reduce((total, set) => total + set.weight, 0);
    return totalWeight / this.exercise.sets.length;
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

  getBodyPartIcon(partOfBody: string): string {
    const icons: {[key: string]: string} = {
      'Chest': 'self_improvement',
      'Back': 'accessibility',
      'Shoulders': 'sports_martial_arts',
      'Arms': 'sports_gymnastics',
      'Legs': 'directions_run',
      'Core': 'fitness_center',
      'Full Body': 'sports'
    };
    return icons[partOfBody] || 'fitness_center';
  }
}
