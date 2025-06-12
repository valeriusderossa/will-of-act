import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { RunningResponse } from '../../models/running.model';
import { RunningRequest } from '../../models/running-request.model';

interface DialogData {
  exercise?: RunningResponse;
  isEdit: boolean;
}

@Component({
  selector: 'app-running-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  template: `
    <div class="running-dialog-container">
      <h2 mat-dialog-title>
        <mat-icon>directions_run</mat-icon>
        {{ isEdit ? 'Edit' : 'Add' }} Running Session
      </h2>

      <mat-dialog-content>
        <form [formGroup]="runningForm" class="form">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Distance (km)</mat-label>
            <input matInput type="number" formControlName="distance" step="0.1" min="0">
            <mat-error *ngIf="runningForm.get('distance')?.hasError('required')">
              Distance is required
            </mat-error>
          </mat-form-field>

          <div class="time-fields">
            <mat-form-field appearance="outline">
              <mat-label>Hours</mat-label>
              <input matInput type="number" formControlName="hours" min="0">
            </mat-form-field>
            
            <mat-form-field appearance="outline">
              <mat-label>Minutes</mat-label>
              <input matInput type="number" formControlName="minutes" min="0" max="59">
            </mat-form-field>
            
            <mat-form-field appearance="outline">
              <mat-label>Seconds</mat-label>
              <input matInput type="number" formControlName="seconds" min="0" max="59">
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Date</mat-label>
            <input matInput [matDatepicker]="picker" formControlName="date">
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>
        </form>
      </mat-dialog-content>

      <mat-dialog-actions>
        <button mat-stroked-button (click)="onCancel()">Cancel</button>
        <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="!runningForm.valid">
          {{ isEdit ? 'Update' : 'Create' }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .running-dialog-container {
      width: 450px;
    }
    .form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px 0;
    }
    .full-width {
      width: 100%;
    }
    .time-fields {
      display: flex;
      gap: 12px;
    }
    .time-fields mat-form-field {
      flex: 1;
    }
    h2 {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  `]
})
export class RunningDialogComponent implements OnInit {
  runningForm: FormGroup;
  isEdit: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<RunningDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: DialogData
  ) {
    this.isEdit = data.isEdit;
    this.runningForm = this.createForm();
  }

  ngOnInit(): void {
    if (this.isEdit && this.data.exercise) {
      this.populateForm(this.data.exercise);
    }
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      distance: [0, [Validators.required, Validators.min(0)]],
      hours: [0, [Validators.min(0)]],
      minutes: [0, [Validators.min(0), Validators.max(59)]],
      seconds: [0, [Validators.min(0), Validators.max(59)]],
      date: [new Date(), Validators.required]
    });
  }

  populateForm(exercise: RunningResponse): void {
    // Parse duration PT25M30S
    const match = exercise.time.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?/);
    const hours = match ? parseInt(match[1] || '0') : 0;
    const minutes = match ? parseInt(match[2] || '0') : 0;
    const seconds = match ? parseInt(match[3] || '0') : 0;

    this.runningForm.patchValue({
      distance: exercise.distance,
      hours: hours,
      minutes: minutes,
      seconds: seconds,
      date: new Date(exercise.date)
    });
  }

  onSubmit(): void {
    if (this.runningForm.valid) {
      const formValue = this.runningForm.value;
      
      // Convert time to ISO 8601 duration
      const hours = formValue.hours || 0;
      const minutes = formValue.minutes || 0;
      const seconds = formValue.seconds || 0;
      
      let duration = 'PT';
      if (hours > 0) duration += `${hours}H`;
      if (minutes > 0) duration += `${minutes}M`;
      if (seconds > 0) duration += `${seconds}S`;
      if (duration === 'PT') duration = 'PT0S';

      const runningRequest: RunningRequest = {
        distance: formValue.distance,
        time: duration,
        date: this.formatDate(formValue.date)
      };

      this.dialogRef.close(runningRequest);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
