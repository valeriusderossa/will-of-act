import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

import { QuotationListComponent } from './quotation-list.component';
import { QuotationService } from '../../services/quotation.service';
import { QuotationResponse } from '../../models/quotation.model';

describe('QuotationListComponent', () => {
  let component: QuotationListComponent;
  let fixture: ComponentFixture<QuotationListComponent>;
  let mockQuotationService: jasmine.SpyObj<QuotationService>;
  let mockDialog: jasmine.SpyObj<MatDialog>;

  const mockQuotations: QuotationResponse[] = [
    {
      id: 1,
      author: 'Albert Einstein',
      quotation: 'Imagination is more important than knowledge.',
      date: '1929-10-26',
      createdAt: '2024-01-01T10:00:00',
      updatedAt: '2024-01-01T10:00:00'
    },
    {
      id: 2,
      author: 'Maya Angelou',
      quotation: 'You may not control all the events that happen to you.',
      date: '1969-04-04',
      createdAt: '2024-01-02T10:00:00',
      updatedAt: '2024-01-02T10:00:00'
    }
  ];

  beforeEach(async () => {
    const quotationServiceSpy = jasmine.createSpyObj('QuotationService', [
      'getAllQuotations',
      'createQuotation',
      'updateQuotation',
      'deleteQuotation'
    ]);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [QuotationListComponent, NoopAnimationsModule],
      providers: [
        { provide: QuotationService, useValue: quotationServiceSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ]
    }).compileComponents();

    mockQuotationService = TestBed.inject(QuotationService) as jasmine.SpyObj<QuotationService>;
    mockDialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;

    mockQuotationService.getAllQuotations.and.returnValue(of(mockQuotations));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load quotations on init', () => {
    expect(mockQuotationService.getAllQuotations).toHaveBeenCalledWith('createdAt');
    expect(component.quotations).toEqual(mockQuotations);
  });

  it('should reload quotations when sort changes', () => {
    mockQuotationService.getAllQuotations.calls.reset();

    component.sortControl.setValue('author');

    expect(mockQuotationService.getAllQuotations).toHaveBeenCalledWith('author');
  });

  it('should truncate long text', () => {
    const longText = 'a'.repeat(200);
    const truncated = component.truncateText(longText, 150);

    expect(truncated.length).toBe(153); // 150 + '...'
    expect(truncated).toEndWith('...');
  });

  it('should generate author initials', () => {
    expect(component.getAuthorInitials('Albert Einstein')).toBe('AE');
    expect(component.getAuthorInitials('Maya Angelou')).toBe('MA');
    expect(component.getAuthorInitials('Single')).toBe('S');
  });

  it('should open add dialog', () => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    dialogRefSpy.afterClosed.and.returnValue(of(null));
    mockDialog.open.and.returnValue(dialogRefSpy);

    component.openAddDialog();

    expect(mockDialog.open).toHaveBeenCalled();
  });

  it('should delete quotation after confirmation', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    mockQuotationService.deleteQuotation.and.returnValue(of(void 0));

    component.deleteQuotation(1);

    expect(mockQuotationService.deleteQuotation).toHaveBeenCalledWith(1);
  });

  it('should not delete quotation if not confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(false);

    component.deleteQuotation(1);

    expect(mockQuotationService.deleteQuotation).not.toHaveBeenCalled();
  });

  it('should format dates correctly', () => {
    const testDate = '2024-01-15';
    const formatted = component.formatDate(testDate);

    expect(formatted).toBeTruthy();
    expect(typeof formatted).toBe('string');
  });
});
