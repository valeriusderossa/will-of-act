import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { QuotationResponse } from '../../models/quotation.model';

export interface QuotationDetailsDialogData {
  quotation: QuotationResponse;
}

@Component({
  selector: 'app-quotation-details-dialog',
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
  templateUrl: './quotation-details-dialog.component.html',
  styleUrl: './quotation-details-dialog.component.scss'
})
export class QuotationDetailsDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<QuotationDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: QuotationDetailsDialogData
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }

  formatQuotationDate(dateString: string): string {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  }

  copyToClipboard(): void {
    const fullQuotation = `"${this.data.quotation.quotation}" - ${this.data.quotation.author}`;
    navigator.clipboard.writeText(fullQuotation).then(() => {
      console.log('Quotation copied to clipboard');
    });
  }
}
