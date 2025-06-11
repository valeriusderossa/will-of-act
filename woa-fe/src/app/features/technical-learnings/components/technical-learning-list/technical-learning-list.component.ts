import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

import {
  TechnicalLearningService,
  TechnicalLearningResponse,
  TechnicalLearningRequest,
  TechnicalLearningSummary,
  TechnicalLearningDialogComponent
} from '../../index';
import { TechnicalLearningDetailsDialogComponent } from '../technical-learning-details-dialog/technical-learning-details-dialog.component';

@Component({
  selector: 'app-technical-learning-list',
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
  templateUrl: './technical-learning-list.component.html',
  styleUrl: './technical-learning-list.component.scss'
})
export class TechnicalLearningListComponent implements OnInit {
  technicalLearnings: TechnicalLearningSummary[] = [];
  displayedColumns: string[] = ['subject', 'language', 'text', 'createdAt', 'actions'];
  loading = false;
  message = '';

  private readonly technicalLearningService = inject(TechnicalLearningService);
  private readonly dialog = inject(MatDialog);

  ngOnInit(): void {
    this.loadTechnicalLearnings();
  }

  loadTechnicalLearnings(): void {
    this.loading = true;
    this.message = '';

    this.technicalLearningService.getAllTechnicalLearnings().subscribe({
      next: (learnings) => {
        this.technicalLearnings = learnings;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading technical learnings:', error);
        this.message = 'Error loading technical learnings';
        this.loading = false;
      }
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(TechnicalLearningDialogComponent, {
      width: '600px',
      data: { isEdit: false }
    });

    dialogRef.afterClosed().subscribe((result: TechnicalLearningRequest) => {
      if (result) {
        this.createTechnicalLearning(result);
      }
    });
  }

  openViewDialog(learning: TechnicalLearningSummary): void {
    // Fetch full details before opening dialog
    this.technicalLearningService.getTechnicalLearningById(learning.id).subscribe({
      next: (fullLearning) => {
        this.dialog.open(TechnicalLearningDetailsDialogComponent, {
          width: '700px',
          data: { learning: fullLearning }
        });
      },
      error: (error) => {
        console.error('Error loading technical learning details:', error);
        this.message = 'Error loading technical learning details';
        setTimeout(() => this.message = '', 3000);
      }
    });
  }

  openEditDialog(learning: TechnicalLearningSummary): void {
    // Fetch full details before opening edit dialog
    this.technicalLearningService.getTechnicalLearningById(learning.id).subscribe({
      next: (fullLearning) => {
        const dialogRef = this.dialog.open(TechnicalLearningDialogComponent, {
          width: '600px',
          data: { learning: fullLearning, isEdit: true }
        });

        dialogRef.afterClosed().subscribe((result: TechnicalLearningRequest) => {
          if (result) {
            this.updateTechnicalLearning(learning.id, result);
          }
        });
      },
      error: (error) => {
        console.error('Error loading technical learning details:', error);
        this.message = 'Error loading technical learning details';
        setTimeout(() => this.message = '', 3000);
      }
    });
  }

  createTechnicalLearning(request: TechnicalLearningRequest): void {
    this.technicalLearningService.createTechnicalLearning(request).subscribe({
      next: () => {
        this.message = 'Technical learning created successfully';
        this.loadTechnicalLearnings();
        setTimeout(() => this.message = '', 3000);
      },
      error: (error) => {
        console.error('Error creating technical learning:', error);
        this.message = 'Error creating technical learning';
        setTimeout(() => this.message = '', 3000);
      }
    });
  }

  updateTechnicalLearning(id: number, request: TechnicalLearningRequest): void {
    this.technicalLearningService.updateTechnicalLearning(id, request).subscribe({
      next: () => {
        this.message = 'Technical learning updated successfully';
        this.loadTechnicalLearnings();
        setTimeout(() => this.message = '', 3000);
      },
      error: (error) => {
        console.error('Error updating technical learning:', error);
        this.message = 'Error updating technical learning';
        setTimeout(() => this.message = '', 3000);
      }
    });
  }

  deleteTechnicalLearning(id: number): void {
    if (confirm('Are you sure you want to delete this technical learning?')) {
      this.technicalLearningService.deleteTechnicalLearning(id).subscribe({
        next: () => {
          this.message = 'Technical learning deleted successfully';
          this.loadTechnicalLearnings();
          setTimeout(() => this.message = '', 3000);
        },
        error: (error) => {
          console.error('Error deleting technical learning:', error);
          this.message = 'Error deleting technical learning';
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

  truncateText(text: string, maxLength: number = 60): string {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }
}
