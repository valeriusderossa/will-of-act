import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { AffirmationDialogComponent, AffirmationDialogData } from './affirmation-dialog.component';
import { AffirmationResponse } from '../../models/affirmation.model';

describe('AffirmationDialogComponent', () => {
  let component: AffirmationDialogComponent;
  let fixture: ComponentFixture<AffirmationDialogComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<AffirmationDialogComponent>>;

  const mockAffirmation: AffirmationResponse = {
    id: 1,
    text: 'Test affirmation',
    createdAt: '2024-01-01T10:00:00',
    updatedAt: '2024-01-01T10:00:00'
  };

  beforeEach(async () => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [
        AffirmationDialogComponent,
        ReactiveFormsModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: { isEdit: false } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AffirmationDialogComponent);
    component = fixture.componentInstance;
    mockDialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<AffirmationDialogComponent>>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    it('should initialize form with empty text for add mode', () => {
      expect(component.affirmationForm.get('text')?.value).toBe('');
      expect(component.isEdit).toBeFalse();
      expect(component.dialogTitle).toBe('Add New Affirmation');
    });

    it('should initialize form with existing text for edit mode', async () => {
      const editData: AffirmationDialogData = {
        affirmation: mockAffirmation,
        isEdit: true
      };

      await TestBed.configureTestingModule({
        imports: [
          AffirmationDialogComponent,
          ReactiveFormsModule,
          NoopAnimationsModule
        ],
        providers: [
          { provide: MatDialogRef, useValue: mockDialogRef },
          { provide: MAT_DIALOG_DATA, useValue: editData }
        ]
      }).compileComponents();

      const editFixture = TestBed.createComponent(AffirmationDialogComponent);
      const editComponent = editFixture.componentInstance;
      editFixture.detectChanges();

      expect(editComponent.affirmationForm.get('text')?.value).toBe('Test affirmation');
      expect(editComponent.isEdit).toBeTrue();
      expect(editComponent.dialogTitle).toBe('Edit Affirmation');
    });
  });

  describe('form validation', () => {
    it('should be invalid when text is empty', () => {
      component.affirmationForm.get('text')?.setValue('');
      expect(component.affirmationForm.valid).toBeFalse();
    });

    it('should be valid when text is provided', () => {
      component.affirmationForm.get('text')?.setValue('Valid text');
      expect(component.affirmationForm.valid).toBeTrue();
    });

    it('should show required error when text is empty', () => {
      const control = component.affirmationForm.get('text');
      control?.setValue('');
      control?.markAsTouched();

      expect(control?.hasError('required')).toBeTrue();
    });
  });

  describe('onSave', () => {
    it('should close dialog with form data when form is valid', () => {
      const testText = 'Test affirmation text';
      component.affirmationForm.get('text')?.setValue(testText);

      component.onSave();

      expect(mockDialogRef.close).toHaveBeenCalledWith({ text: testText });
    });

    it('should not close dialog when form is invalid', () => {
      component.affirmationForm.get('text')?.setValue('');

      component.onSave();

      expect(mockDialogRef.close).not.toHaveBeenCalled();
    });
  });

  describe('onCancel', () => {
    it('should close dialog without data', () => {
      component.onCancel();

      expect(mockDialogRef.close).toHaveBeenCalledWith();
    });
  });

  describe('getters', () => {
    it('should return correct edit status', () => {
      expect(component.isEdit).toBe(component.data.isEdit);
    });

    it('should return correct dialog title', () => {
      const addTitle = component.dialogTitle;
      expect(addTitle).toBe('Add New Affirmation');

      // Test edit title by updating component data
      component.data.isEdit = true;
      const editTitle = component.dialogTitle;
      expect(editTitle).toBe('Edit Affirmation');
    });
  });
});
