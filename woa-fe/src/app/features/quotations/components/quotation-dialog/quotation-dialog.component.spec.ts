import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { QuotationDialogComponent } from './quotation-dialog.component';
import { QuotationResponse } from '../../models/quotation.model';

describe('QuotationDialogComponent', () => {
  let component: QuotationDialogComponent;
  let fixture: ComponentFixture<QuotationDialogComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<QuotationDialogComponent>>;

  const mockQuotation: QuotationResponse = {
    id: 1,
    author: 'Albert Einstein',
    quotation: 'Imagination is more important than knowledge.',
    date: '1929-10-26',
    createdAt: '2024-01-01T10:00:00',
    updatedAt: '2024-01-01T10:00:00'
  };

  beforeEach(async () => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [QuotationDialogComponent, NoopAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: { isEdit: false } }
      ]
    }).compileComponents();

    mockDialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<QuotationDialogComponent>>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values for new quotation', () => {
    expect(component.quotationForm.get('author')?.value).toBe('');
    expect(component.quotationForm.get('quotation')?.value).toBe('');
    expect(component.quotationForm.get('date')?.value).toBeInstanceOf(Date);
  });

  it('should populate form when editing quotation', () => {
    component.data = { quotation: mockQuotation, isEdit: true };
    component.ngOnInit();
    
    expect(component.quotationForm.get('author')?.value).toBe('Albert Einstein');
    expect(component.quotationForm.get('quotation')?.value).toBe('Imagination is more important than knowledge.');
    expect(component.quotationForm.get('date')?.value).toBeInstanceOf(Date);
  });

  it('should return correct title for add mode', () => {
    component.data = { isEdit: false };
    expect(component.getTitle()).toBe('Add New Quotation');
  });

  it('should return correct title for edit mode', () => {
    component.data = { isEdit: true };
    expect(component.getTitle()).toBe('Edit Quotation');
  });

  it('should validate required fields', () => {
    component.quotationForm.patchValue({
      author: '',
      quotation: '',
      date: ''
    });
    
    expect(component.isFormValid()).toBeFalse();
    
    component.quotationForm.patchValue({
      author: 'Test Author',
      quotation: 'This is a test quotation that is long enough.',
      date: new Date()
    });
    
    expect(component.isFormValid()).toBeTrue();
  });

  it('should validate minimum length for quotation', () => {
    component.quotationForm.patchValue({
      author: 'Test Author',
      quotation: 'Short',
      date: new Date()
    });
    
    expect(component.isFormValid()).toBeFalse();
  });

  it('should format date correctly', () => {
    const testDate = new Date('2024-01-15');
    const formatted = component.formatDate(testDate);
    expect(formatted).toBe('2024-01-15');
  });

  it('should close dialog with form data on valid submit', () => {
    component.quotationForm.patchValue({
      author: 'Test Author',
      quotation: 'This is a valid test quotation for testing purposes.',
      date: new Date('2024-01-15')
    });
    
    component.onSubmit();
    
    expect(mockDialogRef.close).toHaveBeenCalledWith({
      author: 'Test Author',
      quotation: 'This is a valid test quotation for testing purposes.',
      date: '2024-01-15'
    });
  });

  it('should not close dialog on invalid submit', () => {
    component.quotationForm.patchValue({
      author: '',
      quotation: '',
      date: ''
    });
    
    component.onSubmit();
    
    expect(mockDialogRef.close).not.toHaveBeenCalled();
  });

  it('should close dialog without data on cancel', () => {
    component.onCancel();
    expect(mockDialogRef.close).toHaveBeenCalledWith();
  });

  it('should detect unsaved changes', () => {
    component.data = { quotation: mockQuotation, isEdit: true };
    component.ngOnInit();
    
    // No changes initially
    expect(component.hasUnsavedChanges()).toBeFalse();
    
    // Make a change
    component.quotationForm.patchValue({ author: 'Different Author' });
    expect(component.hasUnsavedChanges()).toBeTrue();
  });

  it('should provide author suggestions', () => {
    const suggestions = component.getAuthorSuggestions();
    expect(suggestions.length).toBeGreaterThan(0);
    expect(suggestions).toContain('Albert Einstein');
    expect(suggestions).toContain('Maya Angelou');
  });

  it('should get character count correctly', () => {
    component.quotationForm.patchValue({ author: 'Test' });
    expect(component.getCharacterCount('author')).toBe('4/255');
  });
});
