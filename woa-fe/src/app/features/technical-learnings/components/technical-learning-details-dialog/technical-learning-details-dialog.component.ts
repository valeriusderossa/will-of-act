import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { TechnicalLearningResponse } from '../../models/technical-learning.model';

export interface TechnicalLearningDetailsDialogData {
  learning: TechnicalLearningResponse;
}

@Component({
  selector: 'app-technical-learning-details-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule
  ],
  templateUrl: './technical-learning-details-dialog.component.html',
  styleUrl: './technical-learning-details-dialog.component.scss'
})
export class TechnicalLearningDetailsDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<TechnicalLearningDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TechnicalLearningDetailsDialogData
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }

  copyToClipboard(): void {
    const content = `${this.data.learning.subject}\n\nLanguage: ${this.data.learning.language}\n\n${this.data.learning.text}`;
    navigator.clipboard.writeText(content).then(() => {
      console.log('Technical learning copied to clipboard');
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
