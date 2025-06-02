import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { SentenceResponse, SentenceRequest } from '../../index';

export interface SentenceDialogData {
  sentence?: SentenceResponse;
  isEdit: boolean;
}

@Component({
  selector: 'app-sentence-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './sentence-dialog.component.html',
  styleUrl: './sentence-dialog.component.scss'
})
export class SentenceDialogComponent {
  sentenceForm: FormGroup;

  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<SentenceDialogComponent>);

  constructor(@Inject(MAT_DIALOG_DATA) public data: SentenceDialogData) {
    this.sentenceForm = this.fb.group({
      englishText: [
        data.sentence?.englishText || '',
        [Validators.required, Validators.minLength(1)]
      ],
      polishText: [
        data.sentence?.polishText || '',
        [Validators.required, Validators.minLength(1)]
      ],
      pronunciation: [
        data.sentence?.pronunciation || ''
      ]
    });
  }

  get isEdit(): boolean {
    return this.data.isEdit;
  }

  get dialogTitle(): string {
    return this.isEdit ? 'Edit Sentence' : 'Add New Sentence';
  }

  onSave(): void {
    if (this.sentenceForm.valid) {
      const request: SentenceRequest = {
        englishText: this.sentenceForm.value.englishText,
        polishText: this.sentenceForm.value.polishText,
        pronunciation: this.sentenceForm.value.pronunciation || undefined
      };
      this.dialogRef.close(request);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
