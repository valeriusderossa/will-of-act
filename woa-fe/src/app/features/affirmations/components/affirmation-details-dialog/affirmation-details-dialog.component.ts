import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { AffirmationResponse } from '../../models/affirmation.model';

export interface AffirmationDetailsDialogData {
  affirmation: AffirmationResponse;
}

@Component({
  selector: 'app-affirmation-details-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule
  ],
  templateUrl: './affirmation-details-dialog.component.html',
  styleUrl: './affirmation-details-dialog.component.scss'
})
export class AffirmationDetailsDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AffirmationDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AffirmationDetailsDialogData
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }

  copyToClipboard(): void {
    navigator.clipboard.writeText(this.data.affirmation.text).then(() => {
      console.log('Affirmation copied to clipboard');
    });
  }
}
