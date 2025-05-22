import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { AffirmationResponse } from '../../models/affirmation.model';
import { AffirmationRequest } from '../../models/affirmation-request.model';

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

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AffirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AffirmationDialogData
  ) {
    this.affirmationForm = this.fb.group({
      text: [
        data.affirmation?.text || '', 
        [Validators.required, Validators.minLength(1)]
      ]
    });
  }

  get isEdit(): boolean {
    return this.data.isEdit;
  }

  get dialogTitle(): string {
    return this.isEdit ? 'Edit Affirmation' : 'Add New Affirmation';
  }

  onSave(): void {
    if (this.affirmationForm.valid) {
      const request: AffirmationRequest = {
        text: this.affirmationForm.value.text
      };
      this.dialogRef.close(request);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
