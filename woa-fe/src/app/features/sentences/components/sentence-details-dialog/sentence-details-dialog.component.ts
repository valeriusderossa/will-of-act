import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { SentenceResponse } from '../../models/sentence.model';

export interface SentenceDetailsDialogData {
  sentence: SentenceResponse;
}

@Component({
  selector: 'app-sentence-details-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatChipsModule
  ],
  templateUrl: './sentence-details-dialog.component.html',
  styleUrl: './sentence-details-dialog.component.scss'
})
export class SentenceDetailsDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<SentenceDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SentenceDetailsDialogData
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Text copied to clipboard');
    });
  }

  speakText(text: string, lang: string): void {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      speechSynthesis.speak(utterance);
    }
  }
}
