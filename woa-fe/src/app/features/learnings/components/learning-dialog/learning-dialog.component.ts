import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { LearningRequest } from '../../models/learning-request.model';
import { LearningResponse } from '../../models/learning.model';

export interface LearningDialogData {
  learning?: LearningResponse;
  isEdit: boolean;
}

@Component({
  selector: 'app-learning-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule
  ],
  templateUrl: './learning-dialog.component.html',
  styleUrl: './learning-dialog.component.scss'
})
export class LearningDialogComponent implements OnInit {
  learningForm: FormGroup;
  isEdit: boolean;

  commonLanguages = [
    'JavaScript',
    'TypeScript',
    'Python',
    'Java',
    'Kotlin',
    'Swift',
    'C#',
    'Go',
    'Rust',
    'PHP',
    'Ruby',
    'C++',
    'C',
    'Dart',
    'Scala',
    'R',
    'SQL',
    'HTML',
    'CSS',
    'Angular',
    'React',
    'Vue.js',
    'Node.js',
    'Spring',
    'Django',
    'Flutter',
    'Other'
  ];

  constructor(
    public dialogRef: MatDialogRef<LearningDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LearningDialogData,
    private fb: FormBuilder
  ) {
    this.isEdit = data.isEdit;
    this.learningForm = this.createForm();
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

  populateForm(learning: LearningResponse): void {
    this.learningForm.patchValue({
      language: learning.language,
      subject: learning.subject,
      text: learning.text
    });
  }

  onSubmit(): void {
    if (this.learningForm.valid) {
      const formValue = this.learningForm.value;
      const request: LearningRequest = {
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
    Object.keys(this.learningForm.controls).forEach(key => {
      const control = this.learningForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const control = this.learningForm.get(fieldName);
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
    return this.learningForm.get(fieldName)?.value?.length || 0;
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
