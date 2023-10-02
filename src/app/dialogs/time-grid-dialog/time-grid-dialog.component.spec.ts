import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeGridDialogComponent } from './time-grid-dialog.component';

describe('TimeGridDialogComponent', () => {
  let component: TimeGridDialogComponent;
  let fixture: ComponentFixture<TimeGridDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimeGridDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeGridDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
