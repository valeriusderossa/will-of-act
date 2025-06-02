import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { QuotationService } from '../../services/quotation.service';
import { QuotationResponse } from '../../models/quotation.model';
import { QuotationRequest } from '../../models/quotation-request.model';
import { QuotationDialogComponent } from '../quotation-dialog/quotation-dialog.component';

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
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatToolbarModule,
    MatChipsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
    ReactiveFormsModule
  ],
  templateUrl: './quotation-list.component.html',
  styleUrl: './quotation-list.component.scss'
})
export class QuotationListComponent implements OnInit {
  quotations: QuotationResponse[] = [];
  filteredQuotations: QuotationResponse[] = [];
  displayedColumns: string[] = ['author', 'quotation', 'date', 'actions'];
  loading = false;
  message = '';

  searchControl = new FormControl<string>('');
  sortControl = new FormControl<string>('createdAt');
  authorFilterControl = new FormControl<string>('');
  dateFilterControl = new FormControl<Date | null>(null);

  sortOptions = [
    { value: 'createdAt', label: 'Latest First' },
    { value: 'createdAtAsc', label: 'Oldest First' },
    { value: 'author', label: 'Author A-Z' },
    { value: 'authorDesc', label: 'Author Z-A' },
    { value: 'date', label: 'Date Ascending' },
    { value: 'dateDesc', label: 'Date Descending' }
  ];

  uniqueAuthors: string[] = [];

  private readonly quotationService = inject(QuotationService);
  private readonly dialog = inject(MatDialog);

  ngOnInit(): void {
    this.loadQuotations();
    this.setupFilters();
  }

  setupFilters(): void {
    // Search filter
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => this.applyFilters());

    // Sort control
    this.sortControl.valueChanges.subscribe((sortBy) => {
      if (sortBy) {
        this.loadQuotations(sortBy);
      }
    });

    // Author filter
    this.authorFilterControl.valueChanges.subscribe(() => this.applyFilters());

    // Date filter
    this.dateFilterControl.valueChanges.subscribe(() => this.applyFilters());
  }

  loadQuotations(sortBy: string = 'createdAt'): void {
    this.loading = true;
    this.message = '';

    this.quotationService.getAllQuotations(sortBy).subscribe({
      next: (quotations) => {
        this.quotations = quotations;
        this.updateUniqueAuthors();
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading quotations:', error);
        this.message = 'Error loading quotations';
        this.loading = false;
      }
    });
  }

  updateUniqueAuthors(): void {
    this.uniqueAuthors = [...new Set(this.quotations.map(q => q.author))].sort();
  }

  applyFilters(): void {
    let filtered = [...this.quotations];

    // Apply search filter
    const searchTerm = this.searchControl.value?.toLowerCase() || '';
    if (searchTerm) {
      filtered = filtered.filter(quotation =>
        quotation.author.toLowerCase().includes(searchTerm) ||
        quotation.quotation.toLowerCase().includes(searchTerm)
      );
    }

    // Apply author filter
    const authorFilter = this.authorFilterControl.value;
    if (authorFilter) {
      filtered = filtered.filter(quotation => quotation.author === authorFilter);
    }

    // Apply date filter
    const dateFilter = this.dateFilterControl.value;
    if (dateFilter) {
      const filterDate = this.formatDateForComparison(new Date(dateFilter));
      filtered = filtered.filter(quotation =>
        quotation.date === filterDate
      );
    }

    this.filteredQuotations = filtered;
  }

  clearFilters(): void {
    this.searchControl.setValue('');
    this.authorFilterControl.setValue('');
    this.dateFilterControl.setValue(null);
    this.applyFilters();
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(QuotationDialogComponent, {
      width: '600px',
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
      width: '600px',
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
        this.loadQuotations(this.sortControl.value || 'createdAt');
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
        this.loadQuotations(this.sortControl.value || 'createdAt');
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
          this.loadQuotations(this.sortControl.value || 'createdAt');
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

  formatDate(dateString: string | Date): string {
    if (!dateString) return '';
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString();
  }

  formatDateForComparison(date: Date): string {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  }

  truncateText(text: string, maxLength: number = 150): string {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  getDateFilterDisplayValue(): string {
    const dateValue = this.dateFilterControl.value;
    if (!dateValue) return '';
    return this.formatDate(dateValue);
  }

  hasActiveFilters(): boolean {
    return !!(this.searchControl.value ||
              this.authorFilterControl.value ||
              this.dateFilterControl.value);
  }

  getAuthorInitials(author: string): string {
    return author.split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }
}
