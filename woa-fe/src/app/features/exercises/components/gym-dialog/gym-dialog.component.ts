import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';

import { GymResponse } from '../../models/gym.model';
import { GymRequest } from '../../models/gym-request.model';
import { SetEntry } from '../../models/set-entry.model';

interface DialogData {
  exercise?: GymResponse;
  isEdit: boolean;
}

@Component({
  selector: 'app-gym-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule
  ],
  templateUrl: './gym-dialog.component.html',
  styleUrl: './gym-dialog.component.scss'
})
export class GymDialogComponent implements OnInit {
  gymForm: FormGroup;
  isEdit: boolean;

  bodyParts = [
    'Chest',
    'Back', 
    'Shoulders',
    'Arms',
    'Legs',
    'Core',
    'Full Body'
  ];

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<GymDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: DialogData
  ) {
    this.isEdit = data.isEdit;
    this.gymForm = this.createForm();
  }

  ngOnInit(): void {
    if (this.isEdit && this.data.exercise) {
      this.populateForm(this.data.exercise);
    } else {
      // Add one empty set by default for new exercises
      this.addSet();
    }
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      partOfBody: ['', Validators.required],
      date: [new Date(), Validators.required],
      sets: this.formBuilder.array([])
    });
  }

  get setsArray(): FormArray {
    return this.gymForm.get('sets') as FormArray;
  }

  createSetGroup(reps: number = 0, weight: number = 0): FormGroup {
    return this.formBuilder.group({
      reps: [reps, [Validators.required, Validators.min(1)]],
      weight: [weight, [Validators.required, Validators.min(0)]]
    });
  }

  addSet(): void {
    this.setsArray.push(this.createSetGroup());
  }

  removeSet(index: number): void {
    if (this.setsArray.length > 1) {
      this.setsArray.removeAt(index);
    }
  }

  populateForm(exercise: GymResponse): void {
    this.gymForm.patchValue({
      name: exercise.name,
      partOfBody: exercise.partOfBody,
      date: new Date(exercise.date)
    });

    // Clear existing sets and add the exercise sets
    this.setsArray.clear();
    exercise.sets.forEach(set => {
      this.setsArray.push(this.createSetGroup(set.reps, set.weight));
    });
  }

  onSubmit(): void {
    if (this.gymForm.valid) {
      const formValue = this.gymForm.value;
      
      const gymRequest: GymRequest = {
        name: formValue.name,
        partOfBody: formValue.partOfBody,
        date: this.formatDate(formValue.date),
        sets: formValue.sets
      };

      this.dialogRef.close(gymRequest);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  // Helper methods for template
  getSetFormGroup(index: number): FormGroup {
    return this.setsArray.at(index) as FormGroup;
  }

  isFormValid(): boolean {
    return this.gymForm.valid && this.setsArray.length > 0;
  }

  getDialogTitle(): string {
    return this.isEdit ? 'Edit Gym Exercise' : 'Add New Gym Exercise';
  }

  getSubmitButtonText(): string {
    return this.isEdit ? 'Update Exercise' : 'Create Exercise';
  }
}
