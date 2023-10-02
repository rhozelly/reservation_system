import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAdditionalGuestComponent } from './add-additional-guest.component';

describe('AddAdditionalGuestComponent', () => {
  let component: AddAdditionalGuestComponent;
  let fixture: ComponentFixture<AddAdditionalGuestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAdditionalGuestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAdditionalGuestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
