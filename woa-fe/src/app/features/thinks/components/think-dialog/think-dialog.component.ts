import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { ThinkResponse, ThinkRequest } from '../../index';

export interface ThinkDialogData {
  think?: ThinkResponse;
  isEdit: boolean;
}

@Component({
  selector: 'app-think-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './think-dialog.component.html',
  styleUrl: './think-dialog.component.scss'
})
export class ThinkDialogComponent {
  thinkForm: FormGroup;

  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<ThinkDialogComponent>);

  constructor(@Inject(MAT_DIALOG_DATA) public data: ThinkDialogData) {
    this.thinkForm = this.fb.group({
      text: [
        data.think?.text || '',
        [Validators.required, Validators.minLength(1)]
      ]
    });
  }

  get isEdit(): boolean {
    return this.data.isEdit;
  }

  get dialogTitle(): string {
    return this.isEdit ? 'Edit Think' : 'Add New Think';
  }

  onSave(): void {
    if (this.thinkForm.valid) {
      const formValue = this.thinkForm.value;
      const request: ThinkRequest = {
        text: formValue.text.trim()
      };
      this.dialogRef.close(request);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
