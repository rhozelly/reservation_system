import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBookingDialogComponent } from './add-booking-dialog.component';

describe('AddBookingDialogComponent', () => {
  let component: AddBookingDialogComponent;
  let fixture: ComponentFixture<AddBookingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBookingDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBookingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
