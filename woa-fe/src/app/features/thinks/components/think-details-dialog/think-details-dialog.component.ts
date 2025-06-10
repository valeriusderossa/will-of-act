import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { ThinkResponse } from '../../models/think.model';

export interface ThinkDetailsDialogData {
  think: ThinkResponse;
}

@Component({
  selector: 'app-think-details-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule
  ],
  templateUrl: './think-details-dialog.component.html',
  styleUrl: './think-details-dialog.component.scss'
})
export class ThinkDetailsDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ThinkDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ThinkDetailsDialogData
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }

  copyToClipboard(): void {
    navigator.clipboard.writeText(this.data.think.text).then(() => {
      console.log('Think copied to clipboard');
    });
  }
}
