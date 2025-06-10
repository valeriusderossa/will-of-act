import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { ThinkResponse } from '../../models/think.model';

export interface ThinkDetailsDialogData {
  think: ThinkResponse;
}

@Component({
  selector: 'app-think-details-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule
  ],
  templateUrl: './think-details-dialog.component.html',
  styleUrl: './think-details-dialog.component.scss'
})
export class ThinkDetailsDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ThinkDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ThinkDetailsDialogData
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  copyToClipboard(): void {
    navigator.clipboard.writeText(this.data.think.text).then(() => {
      console.log('Think copied to clipboard');
    });
  }

  getWordCount(): number {
    return this.data.think.text.trim().split(/\s+/).length;
  }

  getSentenceCount(): number {
    return this.data.think.text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  }
}
