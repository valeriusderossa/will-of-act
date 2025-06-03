import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';

import {
  SentenceService,
  SentenceResponse,
  SentenceRequest,
  SentenceDialogComponent
} from '../../index';

@Component({
  selector: 'app-sentence-list',
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
  templateUrl: './sentence-list.component.html',
  styleUrl: './sentence-list.component.scss'
})
export class SentenceListComponent implements OnInit {
  sentences: SentenceResponse[] = [];
  displayedColumns: string[] = ['id', 'sentence', 'createdAt', 'actions'];
  loading = false;
  message = '';

  private readonly sentenceService = inject(SentenceService);
  private readonly dialog = inject(MatDialog);

  ngOnInit(): void {
    this.loadSentences();
  }

  loadSentences(): void {
    this.loading = true;
    this.message = '';

    this.sentenceService.getAllSentences().subscribe({
      next: (sentences) => {
        this.sentences = sentences;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading sentences:', error);
        this.message = 'Error loading sentences';
        this.loading = false;
      }
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(SentenceDialogComponent, {
      width: '500px',
      data: { isEdit: false }
    });

    dialogRef.afterClosed().subscribe((result: SentenceRequest) => {
      if (result) {
        this.createSentence(result);
      }
    });
  }

  openEditDialog(sentence: SentenceResponse): void {
    const dialogRef = this.dialog.open(SentenceDialogComponent, {
      width: '500px',
      data: { sentence, isEdit: true }
    });

    dialogRef.afterClosed().subscribe((result: SentenceRequest) => {
      if (result) {
        this.updateSentence(sentence.id, result);
      }
    });
  }

  createSentence(request: SentenceRequest): void {
    this.sentenceService.createSentence(request).subscribe({
      next: () => {
        this.message = 'Sentence created successfully';
        this.loadSentences();
        setTimeout(() => this.message = '', 3000);
      },
      error: (error) => {
        console.error('Error creating sentence:', error);
        this.message = 'Error creating sentence';
        setTimeout(() => this.message = '', 3000);
      }
    });
  }

  updateSentence(id: number, request: SentenceRequest): void {
    this.sentenceService.updateSentence(id, request).subscribe({
      next: () => {
        this.message = 'Sentence updated successfully';
        this.loadSentences();
        setTimeout(() => this.message = '', 3000);
      },
      error: (error) => {
        console.error('Error updating sentence:', error);
        this.message = 'Error updating sentence';
        setTimeout(() => this.message = '', 3000);
      }
    });
  }

  deleteSentence(id: number): void {
    if (confirm('Are you sure you want to delete this sentence?')) {
      this.sentenceService.deleteSentence(id).subscribe({
        next: () => {
          this.message = 'Sentence deleted successfully';
          this.loadSentences();
          setTimeout(() => this.message = '', 3000);
        },
        error: (error) => {
          console.error('Error deleting sentence:', error);
          this.message = 'Error deleting sentence';
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

  truncateText(text: string, maxLength: number = 50): string {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }
}
