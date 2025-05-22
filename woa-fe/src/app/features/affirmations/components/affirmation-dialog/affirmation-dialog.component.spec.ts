import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffirmationDialogComponent } from './affirmation-dialog.component';

describe('AffirmationDialogComponent', () => {
  let component: AffirmationDialogComponent;
  let fixture: ComponentFixture<AffirmationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AffirmationDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AffirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
