import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookingsService } from 'src/app/core/services/bookings.service';
import { MainService } from 'src/app/core/services/main.service';
import { MemberService } from 'src/app/core/services/member.service';

import { AvailabilityComponent } from './availability.component';

describe('AvailabilityComponent', () => {
  let component: AvailabilityComponent;
  let fixture: ComponentFixture<AvailabilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvailabilityComponent ],
      imports: [ HttpClientModule ],
      providers: [
        { provide: MemberService, useClass: MemberService},
        { provide: BookingsService, useClass: BookingsService},
        { provide: MainService, useClass: MainService},
    ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
