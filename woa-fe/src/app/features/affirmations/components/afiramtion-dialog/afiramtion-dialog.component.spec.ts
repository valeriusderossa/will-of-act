import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfiramtionDialogComponent } from './afiramtion-dialog.component';

describe('AfiramtionDialogComponent', () => {
  let component: AfiramtionDialogComponent;
  let fixture: ComponentFixture<AfiramtionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AfiramtionDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AfiramtionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
