import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

import {
  LearningService,
  LearningResponse,
  LearningRequest,
  LearningDialogComponent
} from '../../index';
import { LearningDetailsDialogComponent } from '../learning-details-dialog/learning-details-dialog.component';

@Component({
  selector: 'app-learning-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
  templateUrl: './learning-list.component.html',
  styleUrl: './learning-list.component.scss'
})
export class LearningListComponent implements OnInit {
  learnings: LearningResponse[] = [];
  filteredLearnings: LearningResponse[] = [];
  displayedColumns: string[] = ['subject', 'language', 'text', 'createdAt', 'actions'];
  loading = false;
  message = '';
  searchQuery = '';
  selectedLanguage = '';

  private readonly learningService = inject(LearningService);
  private readonly dialog = inject(MatDialog);

  ngOnInit(): void {
    this.loadLearnings();
  }

  loadLearnings(): void {
    this.loading = true;
    this.message = '';

    this.learningService.getAllLearnings().subscribe({
      next: (learnings) => {
        this.learnings = learnings;
        this.filteredLearnings = learnings;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading learnings:', error);
        this.message = 'Error loading learnings';
        this.loading = false;
      }
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(LearningDialogComponent, {
      width: '600px',
      data: { isEdit: false }
    });

    dialogRef.afterClosed().subscribe((result: LearningRequest) => {
      if (result) {
        this.createLearning(result);
      }
    });
  }

  openViewDialog(learning: LearningResponse): void {
    this.dialog.open(LearningDetailsDialogComponent, {
      width: '700px',
      data: { learning }
    });
  }

  openEditDialog(learning: LearningResponse): void {
    const dialogRef = this.dialog.open(LearningDialogComponent, {
      width: '600px',
      data: { learning, isEdit: true }
    });

    dialogRef.afterClosed().subscribe((result: LearningRequest) => {
      if (result) {
        this.updateLearning(learning.id, result);
      }
    });
  }

  createLearning(request: LearningRequest): void {
    this.learningService.createLearning(request).subscribe({
      next: () => {
        this.message = 'Learning created successfully';
        this.loadLearnings();
        setTimeout(() => this.message = '', 3000);
      },
      error: (error) => {
        console.error('Error creating learning:', error);
        this.message = 'Error creating learning';
        setTimeout(() => this.message = '', 3000);
      }
    });
  }

  updateLearning(id: number, request: LearningRequest): void {
    this.learningService.updateLearning(id, request).subscribe({
      next: () => {
        this.message = 'Learning updated successfully';
        this.loadLearnings();
        setTimeout(() => this.message = '', 3000);
      },
      error: (error) => {
        console.error('Error updating learning:', error);
        this.message = 'Error updating learning';
        setTimeout(() => this.message = '', 3000);
      }
    });
  }

  deleteLearning(id: number): void {
    if (confirm('Are you sure you want to delete this learning?')) {
      this.learningService.deleteLearning(id).subscribe({
        next: () => {
          this.message = 'Learning deleted successfully';
          this.loadLearnings();
          setTimeout(() => this.message = '', 3000);
        },
        error: (error) => {
          console.error('Error deleting learning:', error);
          this.message = 'Error deleting learning';
          setTimeout(() => this.message = '', 3000);
        }
      });
    }
  }

  onSearch(): void {
    this.applyFilters();
  }

  onLanguageFilter(language: string): void {
    this.selectedLanguage = this.selectedLanguage === language ? '' : language;
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = this.learnings;

    // Apply search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(learning =>
        learning.subject.toLowerCase().includes(query) ||
        learning.text.toLowerCase().includes(query) ||
        learning.language.toLowerCase().includes(query)
      );
    }

    // Apply language filter
    if (this.selectedLanguage) {
      filtered = filtered.filter(learning => learning.language === this.selectedLanguage);
    }

    this.filteredLearnings = filtered;
  }

  getUniqueLanguages(): string[] {
    const languages = this.learnings.map(learning => learning.language);
    return [...new Set(languages)].sort();
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  truncateText(text: string, maxLength: number = 60): string {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
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
