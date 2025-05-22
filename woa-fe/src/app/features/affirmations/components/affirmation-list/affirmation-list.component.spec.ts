import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';

import { AffirmationListComponent } from './affirmation-list.component';
import { AffirmationService } from '../../services/affirmation.service';
import { AffirmationResponse } from '../../models/affirmation.model';

describe('AffirmationListComponent', () => {
  let component: AffirmationListComponent;
  let fixture: ComponentFixture<AffirmationListComponent>;
  let mockAffirmationService: jasmine.SpyObj<AffirmationService>;
  let mockDialog: jasmine.SpyObj<MatDialog>;

  const mockAffirmations: AffirmationResponse[] = [
    { id: 1, text: 'Test affirmation 1', createdAt: '2024-01-01T10:00:00', updatedAt: '2024-01-01T10:00:00' },
    { id: 2, text: 'Test affirmation 2', createdAt: '2024-01-02T10:00:00', updatedAt: '2024-01-02T10:00:00' }
  ];

  beforeEach(async () => {
    const affirmationServiceSpy = jasmine.createSpyObj('AffirmationService', [
      'getAllAffirmations', 'createAffirmation', 'updateAffirmation', 'deleteAffirmation'
    ]);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        AffirmationListComponent,
        NoopAnimationsModule
      ],
      providers: [
        { provide: AffirmationService, useValue: affirmationServiceSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AffirmationListComponent);
    component = fixture.componentInstance;
    mockAffirmationService = TestBed.inject(AffirmationService) as jasmine.SpyObj<AffirmationService>;
    mockDialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load affirmations on init', () => {
      mockAffirmationService.getAllAffirmations.and.returnValue(of(mockAffirmations));

      component.ngOnInit();

      expect(mockAffirmationService.getAllAffirmations).toHaveBeenCalled();
      expect(component.affirmations).toEqual(mockAffirmations);
      expect(component.loading).toBeFalse();
    });

    it('should handle error when loading affirmations fails', () => {
      mockAffirmationService.getAllAffirmations.and.returnValue(
        throwError(() => new Error('API Error'))
      );

      component.ngOnInit();

      expect(component.loading).toBeFalse();
      expect(component.message).toBe('Error loading affirmations');
      expect(component.affirmations).toEqual([]);
    });
  });

  describe('openAddDialog', () => {
    it('should open dialog and create affirmation on save', () => {
      const dialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
      const newAffirmation = { text: 'New affirmation' };
      const createdAffirmation: AffirmationResponse = {
        id: 3,
        text: 'New affirmation',
        createdAt: '2024-01-03T10:00:00',
        updatedAt: '2024-01-03T10:00:00'
      };

      mockDialog.open.and.returnValue(dialogRef);
      dialogRef.afterClosed.and.returnValue(of(newAffirmation));
      mockAffirmationService.createAffirmation.and.returnValue(of(createdAffirmation));
      mockAffirmationService.getAllAffirmations.and.returnValue(of([...mockAffirmations, createdAffirmation]));

      component.openAddDialog();

      expect(mockDialog.open).toHaveBeenCalledWith(jasmine.any(Function), {
        width: '500px',
        data: { isEdit: false }
      });
      expect(mockAffirmationService.createAffirmation).toHaveBeenCalledWith(newAffirmation);
    });
  });

  describe('openEditDialog', () => {
    it('should open dialog and update affirmation on save', () => {
      const dialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
      const updatedData = { text: 'Updated affirmation' };
      const updatedAffirmation: AffirmationResponse = {
        ...mockAffirmations[0],
        text: 'Updated affirmation'
      };

      mockDialog.open.and.returnValue(dialogRef);
      dialogRef.afterClosed.and.returnValue(of(updatedData));
      mockAffirmationService.updateAffirmation.and.returnValue(of(updatedAffirmation));
      mockAffirmationService.getAllAffirmations.and.returnValue(of([updatedAffirmation, mockAffirmations[1]]));

      component.openEditDialog(mockAffirmations[0]);

      expect(mockDialog.open).toHaveBeenCalledWith(jasmine.any(Function), {
        width: '500px',
        data: { affirmation: mockAffirmations[0], isEdit: true }
      });
      expect(mockAffirmationService.updateAffirmation).toHaveBeenCalledWith(1, updatedData);
    });
  });

  describe('deleteAffirmation', () => {
    it('should delete affirmation after confirmation', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      mockAffirmationService.deleteAffirmation.and.returnValue(of(void 0));
      mockAffirmationService.getAllAffirmations.and.returnValue(of([mockAffirmations[1]]));

      component.deleteAffirmation(1);

      expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this affirmation?');
      expect(mockAffirmationService.deleteAffirmation).toHaveBeenCalledWith(1);
      expect(component.message).toBe('Affirmation deleted successfully');
    });

    it('should not delete affirmation if not confirmed', () => {
      spyOn(window, 'confirm').and.returnValue(false);

      component.deleteAffirmation(1);

      expect(mockAffirmationService.deleteAffirmation).not.toHaveBeenCalled();
    });
  });

  describe('utility methods', () => {
    it('should format date correctly', () => {
      const dateString = '2024-01-01T10:00:00';
      const formatted = component.formatDate(dateString);
      expect(formatted).toBe('1/1/2024'); // US format
    });

    it('should truncate long text', () => {
      const longText = 'This is a very long text that should be truncated because it exceeds the maximum length specified in the truncate method';
      const truncated = component.truncateText(longText, 50);
      expect(truncated).toBe('This is a very long text that should be truncated...');
    });

    it('should not truncate short text', () => {
      const shortText = 'Short text';
      const result = component.truncateText(shortText, 50);
      expect(result).toBe('Short text');
    });
  });
});
