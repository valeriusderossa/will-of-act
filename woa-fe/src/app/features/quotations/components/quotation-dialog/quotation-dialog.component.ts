import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { QuotationResponse, QuotationRequest } from '../../index';

export interface QuotationDialogData {
  quotation?: QuotationResponse;
  isEdit: boolean;
}

@Component({
  selector: 'app-quotation-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './quotation-dialog.component.html',
  styleUrl: './quotation-dialog.component.scss'
})
export class QuotationDialogComponent {
  quotationForm: FormGroup;

  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<QuotationDialogComponent>);

  constructor(@Inject(MAT_DIALOG_DATA) public data: QuotationDialogData) {
    this.quotationForm = this.fb.group({
      author: [
        data.quotation?.author || '',
        [Validators.required, Validators.minLength(1)]
      ],
      quotation: [
        data.quotation?.quotation || '',
        [Validators.required, Validators.minLength(1)]
      ],
      date: [
        data.quotation ? new Date(data.quotation.date) : new Date(),
        [Validators.required]
      ]
    });
  }

  get isEdit(): boolean {
    return this.data.isEdit;
  }

  get dialogTitle(): string {
    return this.isEdit ? 'Edit Quotation' : 'Add New Quotation';
  }

  onSave(): void {
    if (this.quotationForm.valid) {
      const formValue = this.quotationForm.value;
      const request: QuotationRequest = {
        author: formValue.author.trim(),
        quotation: formValue.quotation.trim(),
        date: this.formatDate(formValue.date)
      };
      this.dialogRef.close(request);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
