import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

import { QuotationResponse } from '../../models/quotation.model';
import { QuotationRequest } from '../../models/quotation-request.model';

interface DialogData {
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
    MatNativeDateModule,
    MatIconModule,
    MatToolbarModule
  ],
  templateUrl: './quotation-dialog.component.html',
  styleUrl: './quotation-dialog.component.scss'
})
export class QuotationDialogComponent implements OnInit {
  quotationForm: FormGroup;
  maxDate = new Date();

  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<QuotationDialogComponent>);

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.quotationForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
      quotation: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(2000)]],
      date: [new Date(), Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.data.isEdit && this.data.quotation) {
      this.populateForm(this.data.quotation);
    }
    // Default date is already set in constructor for new quotations
  }

  populateForm(quotation: QuotationResponse): void {
    this.quotationForm.patchValue({
      author: quotation.author,
      quotation: quotation.quotation,
      date: new Date(quotation.date)
    });
  }

  getTitle(): string {
    return this.data.isEdit ? 'Edit Quotation' : 'Add New Quotation';
  }

  getSubmitButtonText(): string {
    return this.data.isEdit ? 'Update' : 'Create';
  }

  getFormFieldError(fieldName: string): string {
    const field = this.quotationForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${this.getFieldDisplayName(fieldName)} is required`;
      }
      if (field.errors['minlength']) {
        const requiredLength = field.errors['minlength'].requiredLength;
        return `${this.getFieldDisplayName(fieldName)} must be at least ${requiredLength} characters`;
      }
      if (field.errors['maxlength']) {
        const requiredLength = field.errors['maxlength'].requiredLength;
        return `${this.getFieldDisplayName(fieldName)} cannot exceed ${requiredLength} characters`;
      }
    }
    return '';
  }

  getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      author: 'Author',
      quotation: 'Quotation',
      date: 'Date'
    };
    return displayNames[fieldName] || fieldName;
  }

  getCharacterCount(fieldName: string): string {
    const value = this.quotationForm.get(fieldName)?.value || '';
    const maxLength = fieldName === 'author' ? 255 : 2000;
    return `${value.length}/${maxLength}`;
  }

  onSubmit(): void {
    if (this.quotationForm.valid) {
      const formValue = this.quotationForm.value;
      const quotationRequest: QuotationRequest = {
        author: formValue.author.trim(),
        quotation: formValue.quotation.trim(),
        date: this.formatDate(formValue.date)
      };

      this.dialogRef.close(quotationRequest);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.quotationForm.controls).forEach(key => {
        this.quotationForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  formatDate(date: Date | string): string {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toISOString().split('T')[0];
  }

  // Suggestions for famous authors
  getAuthorSuggestions(): string[] {
    return [
      'Albert Einstein',
      'Maya Angelou',
      'Winston Churchill',
      'Nelson Mandela',
      'Martin Luther King Jr.',
      'Steve Jobs',
      'Mahatma Gandhi',
      'Mark Twain',
      'Oscar Wilde',
      'Friedrich Nietzsche',
      'Aristotle',
      'Plato',
      'Confucius',
      'Benjamin Franklin',
      'Theodore Roosevelt'
    ];
  }

  isFormValid(): boolean {
    return this.quotationForm.valid;
  }

  hasUnsavedChanges(): boolean {
    if (!this.data.isEdit) {
      return this.quotationForm.dirty;
    }

    const original = this.data.quotation;
    const current = this.quotationForm.value;

    return (
      original?.author !== current.author?.trim() ||
      original?.quotation !== current.quotation?.trim() ||
      original?.date !== this.formatDate(current.date)
    );
  }
}
