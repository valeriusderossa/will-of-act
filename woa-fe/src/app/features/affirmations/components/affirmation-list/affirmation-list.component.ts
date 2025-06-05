import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import {
  AffirmationService,
  AffirmationResponse,
  AffirmationRequest,
  AffirmationDialogComponent
} from '../../index';

@Component({
  selector: 'app-affirmation-list',
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
  templateUrl: './affirmation-list.component.html',
  styleUrl: './affirmation-list.component.scss'
})
export class AffirmationListComponent implements OnInit {
  affirmations: AffirmationResponse[] = [];
  displayedColumns: string[] = ['text', 'createdAt', 'actions'];
  loading = false;
  message = '';

  private readonly affirmationService = inject(AffirmationService);
  private readonly dialog = inject(MatDialog);

  ngOnInit(): void {
    this.loadAffirmations();
  }

  loadAffirmations(): void {
    this.loading = true;
    this.message = '';
    this.affirmationService.getAllAffirmations().subscribe({
      next: (affirmations) => {
        this.affirmations = affirmations;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading affirmations:', error);
        this.message = 'Error loading affirmations';
        this.loading = false;
      }
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AffirmationDialogComponent, {
      width: '600px',
      data: { isEdit: false }
    });

    dialogRef.afterClosed().subscribe((result: AffirmationRequest) => {
      if (result) {
        this.createAffirmation(result);
      }
    });
  }

  openEditDialog(affirmation: AffirmationResponse): void {
    const dialogRef = this.dialog.open(AffirmationDialogComponent, {
      width: '600px',
      data: { affirmation, isEdit: true }
    });

    dialogRef.afterClosed().subscribe((result: AffirmationRequest) => {
      if (result) {
        this.updateAffirmation(affirmation.id, result);
      }
    });
  }

  createAffirmation(request: AffirmationRequest): void {
    this.affirmationService.createAffirmation(request).subscribe({
      next: () => {
        this.message = 'Affirmation created successfully';
        this.loadAffirmations();
        setTimeout(() => this.message = '', 3000);
      },
      error: (error) => {
        console.error('Error creating affirmation:', error);
        this.message = 'Error creating affirmation';
        setTimeout(() => this.message = '', 3000);
      }
    });
  }

  updateAffirmation(id: number, request: AffirmationRequest): void {
    this.affirmationService.updateAffirmation(id, request).subscribe({
      next: () => {
        this.message = 'Affirmation updated successfully';
        this.loadAffirmations();
        setTimeout(() => this.message = '', 3000);
      },
      error: (error) => {
        console.error('Error updating affirmation:', error);
        this.message = 'Error updating affirmation';
        setTimeout(() => this.message = '', 3000);
      }
    });
  }

  deleteAffirmation(id: number): void {
    if (confirm('Are you sure you want to delete this affirmation?')) {
      this.affirmationService.deleteAffirmation(id).subscribe({
        next: () => {
          this.message = 'Affirmation deleted successfully';
          this.loadAffirmations();
          setTimeout(() => this.message = '', 3000);
        },
        error: (error) => {
          console.error('Error deleting affirmation:', error);
          this.message = 'Error deleting affirmation';
          setTimeout(() => this.message = '', 3000);
        }
      });
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  truncateText(text: string, maxLength: number = 100): string {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }
}
