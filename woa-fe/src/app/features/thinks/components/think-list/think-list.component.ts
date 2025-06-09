import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';

import {
  ThinkService,
  ThinkResponse,
  ThinkRequest,
  ThinkDialogComponent
} from '../../index';

@Component({
  selector: 'app-think-list',
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
  templateUrl: './think-list.component.html',
  styleUrl: './think-list.component.scss'
})
export class ThinkListComponent implements OnInit {
  thinks: ThinkResponse[] = [];
  displayedColumns: string[] = ['text', 'createdAt', 'actions'];
  loading = false;
  message = '';

  private readonly thinkService = inject(ThinkService);
  private readonly dialog = inject(MatDialog);

  ngOnInit(): void {
    this.loadThinks();
  }

  loadThinks(): void {
    this.loading = true;
    this.message = '';

    this.thinkService.getAllThinks().subscribe({
      next: (thinks) => {
        this.thinks = thinks;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading thinks:', error);
        this.message = 'Error loading thinks';
        this.loading = false;
      }
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(ThinkDialogComponent, {
      width: '500px',
      data: { isEdit: false }
    });

    dialogRef.afterClosed().subscribe((result: ThinkRequest) => {
      if (result) {
        this.createThink(result);
      }
    });
  }

  openEditDialog(think: ThinkResponse): void {
    const dialogRef = this.dialog.open(ThinkDialogComponent, {
      width: '500px',
      data: { think, isEdit: true }
    });

    dialogRef.afterClosed().subscribe((result: ThinkRequest) => {
      if (result) {
        this.updateThink(think.id, result);
      }
    });
  }

  createThink(request: ThinkRequest): void {
    this.thinkService.createThink(request).subscribe({
      next: () => {
        this.message = 'Think created successfully';
        this.loadThinks();
        setTimeout(() => this.message = '', 3000);
      },
      error: (error) => {
        console.error('Error creating think:', error);
        this.message = 'Error creating think';
        setTimeout(() => this.message = '', 3000);
      }
    });
  }

  updateThink(id: number, request: ThinkRequest): void {
    this.thinkService.updateThink(id, request).subscribe({
      next: () => {
        this.message = 'Think updated successfully';
        this.loadThinks();
        setTimeout(() => this.message = '', 3000);
      },
      error: (error) => {
        console.error('Error updating think:', error);
        this.message = 'Error updating think';
        setTimeout(() => this.message = '', 3000);
      }
    });
  }

  deleteThink(id: number): void {
    if (confirm('Are you sure you want to delete this think?')) {
      this.thinkService.deleteThink(id).subscribe({
        next: () => {
          this.message = 'Think deleted successfully';
          this.loadThinks();
          setTimeout(() => this.message = '', 3000);
        },
        error: (error) => {
          console.error('Error deleting think:', error);
          this.message = 'Error deleting think';
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
