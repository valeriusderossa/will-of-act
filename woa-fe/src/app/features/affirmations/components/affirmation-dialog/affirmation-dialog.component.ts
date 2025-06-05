import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { AffirmationResponse, AffirmationRequest } from '../../index';

export interface AffirmationDialogData {
  affirmation?: AffirmationResponse;
  isEdit: boolean;
}

@Component({
  selector: 'app-affirmation-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './affirmation-dialog.component.html',
  styleUrl: './affirmation-dialog.component.scss'
})
export class AffirmationDialogComponent {
  affirmationForm: FormGroup;

  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<AffirmationDialogComponent>);

  constructor(@Inject(MAT_DIALOG_DATA) public data: AffirmationDialogData) {
    this.affirmationForm = this.fb.group({
      text: [
        data.affirmation?.text || '',
        [Validators.required, Validators.minLength(1), Validators.maxLength(2000)]
      ]
    });
  }

  get isEdit(): boolean {
    return this.data.isEdit;
  }

  get dialogTitle(): string {
    return this.isEdit ? 'Edit Affirmation' : 'Add New Affirmation';
  }

  getTextLength(): number {
    const textValue = this.affirmationForm.get('text')?.value;
    return textValue ? textValue.length : 0;
  }

  onSave(): void {
    if (this.affirmationForm.valid) {
      const formValue = this.affirmationForm.value;
      const request: AffirmationRequest = {
        text: formValue.text.trim()
      };
      this.dialogRef.close(request);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
