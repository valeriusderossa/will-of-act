import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { TechnicalLearningRequest } from '../../models/technical-learning-request.model';
import { TechnicalLearningResponse } from '../../models/technical-learning.model';

export interface TechnicalLearningDialogData {
  learning?: TechnicalLearningResponse;
  isEdit: boolean;
}

@Component({
  selector: 'app-technical-learning-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule
  ],
  templateUrl: './technical-learning-dialog.component.html',
  styleUrl: './technical-learning-dialog.component.scss'
})
export class TechnicalLearningDialogComponent implements OnInit {
  technicalLearningForm: FormGroup;
  isEdit: boolean;

  constructor(
    public dialogRef: MatDialogRef<TechnicalLearningDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TechnicalLearningDialogData,
    private fb: FormBuilder
  ) {
    this.isEdit = data.isEdit;
    this.technicalLearningForm = this.createForm();
  }

  ngOnInit(): void {
    if (this.isEdit && this.data.learning) {
      this.populateForm(this.data.learning);
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      language: ['', [Validators.required, Validators.maxLength(50)]],
      subject: ['', [Validators.required, Validators.maxLength(200)]],
      text: ['', [Validators.required, Validators.maxLength(5000)]]
    });
  }

  populateForm(learning: TechnicalLearningResponse): void {
    this.technicalLearningForm.patchValue({
      language: learning.language,
      subject: learning.subject,
      text: learning.text
    });
  }

  onSubmit(): void {
    if (this.technicalLearningForm.valid) {
      const formValue = this.technicalLearningForm.value;
      const request: TechnicalLearningRequest = {
        language: formValue.language.trim(),
        subject: formValue.subject.trim(),
        text: formValue.text.trim()
      };
      this.dialogRef.close(request);
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.technicalLearningForm.controls).forEach(key => {
      const control = this.technicalLearningForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const control = this.technicalLearningForm.get(fieldName);
    if (control?.hasError('required') && control?.touched) {
      return `${this.getFieldDisplayName(fieldName)} is required`;
    }
    if (control?.hasError('maxlength') && control?.touched) {
      const maxLength = control.errors?.['maxlength']?.requiredLength;
      return `${this.getFieldDisplayName(fieldName)} cannot exceed ${maxLength} characters`;
    }
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      language: 'Language',
      subject: 'Subject',
      text: 'Description'
    };
    return displayNames[fieldName] || fieldName;
  }

  getCharacterCount(fieldName: string): number {
    return this.technicalLearningForm.get(fieldName)?.value?.length || 0;
  }

  getMaxLength(fieldName: string): number {
    const maxLengths: { [key: string]: number } = {
      language: 50,
      subject: 200,
      text: 5000
    };
    return maxLengths[fieldName] || 0;
  }
}
