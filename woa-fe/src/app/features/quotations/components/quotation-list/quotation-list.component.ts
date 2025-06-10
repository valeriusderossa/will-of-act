import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';

import {
  QuotationService,
  QuotationResponse,
  QuotationRequest,
  QuotationDialogComponent
} from '../../index';
import { QuotationDetailsDialogComponent } from '../quotation-details-dialog/quotation-details-dialog.component';

@Component({
  selector: 'app-quotation-list',
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
  templateUrl: './quotation-list.component.html',
  styleUrl: './quotation-list.component.scss'
})
export class QuotationListComponent implements OnInit {
  quotations: QuotationResponse[] = [];
  displayedColumns: string[] = ['quotation', 'createdAt', 'actions'];
  loading = false;
  message = '';

  private readonly quotationService = inject(QuotationService);
  private readonly dialog = inject(MatDialog);

  ngOnInit(): void {
    this.loadQuotations();
  }

  loadQuotations(): void {
    this.loading = true;
    this.message = '';

    this.quotationService.getAllQuotations().subscribe({
      next: (quotations) => {
        this.quotations = quotations;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading quotations:', error);
        this.message = 'Error loading quotations';
        this.loading = false;
      }
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(QuotationDialogComponent, {
      width: '500px',
      data: { isEdit: false }
    });

    dialogRef.afterClosed().subscribe((result: QuotationRequest) => {
      if (result) {
        this.createQuotation(result);
      }
    });
  }

  openEditDialog(quotation: QuotationResponse): void {
    const dialogRef = this.dialog.open(QuotationDialogComponent, {
      width: '500px',
      data: { quotation, isEdit: true }
    });

    dialogRef.afterClosed().subscribe((result: QuotationRequest) => {
      if (result) {
        this.updateQuotation(quotation.id, result);
      }
    });
  }

  createQuotation(request: QuotationRequest): void {
    this.quotationService.createQuotation(request).subscribe({
      next: () => {
        this.message = 'Quotation created successfully';
        this.loadQuotations();
        setTimeout(() => this.message = '', 3000);
      },
      error: (error) => {
        console.error('Error creating quotation:', error);
        this.message = 'Error creating quotation';
        setTimeout(() => this.message = '', 3000);
      }
    });
  }

  updateQuotation(id: number, request: QuotationRequest): void {
    this.quotationService.updateQuotation(id, request).subscribe({
      next: () => {
        this.message = 'Quotation updated successfully';
        this.loadQuotations();
        setTimeout(() => this.message = '', 3000);
      },
      error: (error) => {
        console.error('Error updating quotation:', error);
        this.message = 'Error updating quotation';
        setTimeout(() => this.message = '', 3000);
      }
    });
  }

  deleteQuotation(id: number): void {
    if (confirm('Are you sure you want to delete this quotation?')) {
      this.quotationService.deleteQuotation(id).subscribe({
        next: () => {
          this.message = 'Quotation deleted successfully';
          this.loadQuotations();
          setTimeout(() => this.message = '', 3000);
        },
        error: (error) => {
          console.error('Error deleting quotation:', error);
          this.message = 'Error deleting quotation';
          setTimeout(() => this.message = '', 3000);
        }
      });
    }
  }

  openViewDialog(quotation: QuotationResponse): void {
    this.dialog.open(QuotationDetailsDialogComponent, {
      width: '650px',
      data: { quotation }
    });
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
