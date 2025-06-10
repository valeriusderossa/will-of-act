import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { LearningResponse } from '../../models/learning.model';

export interface LearningDetailsDialogData {
  learning: LearningResponse;
}

@Component({
  selector: 'app-learning-details-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule
  ],
  templateUrl: './learning-details-dialog.component.html',
  styleUrl: './learning-details-dialog.component.scss'
})
export class LearningDetailsDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<LearningDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LearningDetailsDialogData
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }

  copyToClipboard(): void {
    const content = `${this.data.learning.subject}\n\nLanguage: ${this.data.learning.language}\n\n${this.data.learning.text}`;
    navigator.clipboard.writeText(content).then(() => {
      console.log('Learning copied to clipboard');
    });
  }

  getLanguageColor(language: string): string {
    const colors = {
      'kotlin': 'primary',
      'java': 'accent',
      'javascript': 'warn',
      'typescript': 'primary',
      'python': 'accent',
      'angular': 'warn'
    };
    return (colors as any)[language.toLowerCase()] || 'primary';
  }
}
