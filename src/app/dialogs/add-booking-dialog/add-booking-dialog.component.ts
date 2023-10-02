import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, Observable, startWith } from 'rxjs';
import { BookingsService } from 'src/app/core/services/bookings.service';
import { MainService } from 'src/app/core/services/main.service';
import { MemberService } from 'src/app/core/services/member.service';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import * as moment from 'moment';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { CustomerService } from 'src/app/core/services/customer.service';

@Component({
  selector: 'app-add-booking-dialog',
  templateUrl: './add-booking-dialog.component.html',
  styleUrls: ['./add-booking-dialog.component.css']
})
export class AddBookingDialogComponent implements OnInit {
  selectedDate: any = [];
  minDate!: Date | null;
  startAt: Date = new Date(1987, 0, 1);
  startView: string = "multi-year";
  times: any = [];
  branches: any = [];
  rooms: any = [];
  services: any = [];
  members: any = [];
  userRole: any = [];
  userId: any = [];

  modes: any = ['cash', 'gcash', 'gc']
  discounts: any = [];

  bookForm!: FormGroup;
  servicesFormGroup!: FormGroup;

  myTherapistControl = new FormControl();
  currentBranch: any;
  selectedBranch: any;
  selectedService: any;
  selectedTherapist: any = 0;

  bookings: any = [];
  hours_booked: any = [];
  hours_booked_avail: any = [];
  sameIndexes: any = [];
  actionDialog: boolean = true;

  filteredOptions: Observable<any[]> | undefined;
  filteredOptionsTherapist?: Observable<any[]>;
  serviceArrayOptions: Observable<any[]> | undefined;

  bookGuestForm!: FormGroup;
  guests!: FormArray;
  servicesArray: any = [];

  separatorKeysCodes: number[] = [ENTER, COMMA];
  serviceCtrl = new FormControl();
  filteredServices!: Observable<any[]>;
  filteredService: any = [];
  filteredServiceArray: any = [];

  bookingPax: boolean = true;
  servicePax: boolean = true;

  latestBookPax: any = 0;
  discountPercentage: any = 0;
  discountPercentageDecimal: any = 0;
  discountID: any = 0;
  selectedServiceForDiscount: any = 0;
  extraTime: any = 0;
  gcAmount: any = '';

  paymentTable: any = [];
  roomSelectedData: any = [];
  TBA: any = [];
  restricted: boolean = false;


  customerFormControl = new FormControl('');
  // customer: string[] = ['One', 'Two', 'Three'];
  customer: any = [];
  customerOptions: Observable<any[]> | undefined;

  @ViewChild('serviceInput') serviceInput!: ElementRef<HTMLInputElement>;

  constructor(
    public dialogRef: MatDialogRef<AddBookingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private main: MainService,
    private book: BookingsService,
    private mem: MemberService,
    private cus: CustomerService,
  ) {
  }

  ngOnInit(): void {
    this.userRole = this.main.getCurrentUserPrivileges();
    this.userId = this.main.getCurrentUserAccId();
    this.getExtraTime(this.main.getCurrentUserBranch());
    this.getLatestBookPaxId()
    this.bookForm = this.fb.group({
      branch_id: ['', Validators.required],
      book_guest_id: [''],
      book_pax_id: [this.latestBookPax || 0],
      mem_id: [''],
      disc_id: ['0'],
      price: [''],
      total_price: [''],
      mode_of_payment: [''],
      service_id: [''],
      book_id: [''],
      room_id: [0],
      book_guest_name: ['', Validators.required],
      book_guest_number: ['', Validators.required],
      booked_date: ['', Validators.required],
      booked_status: [0],
      book_pax: ['', Validators.required],
      time_start: ['', Validators.required],
      time_end: [''],
      booked_by: [this.userId],
      notes: [''],
    });
    this.customerOptions = this.customerFormControl.valueChanges.pipe(
      startWith(''),
      map(value => this.__filter(value || '')),
    ); 0

    this.servicesFormGroup = this.fb.group({
      services: this.fb.array([this.createServices()]),
    });
    this.bookForm.get('booked_date')?.valueChanges.subscribe((value: any) => {
      this.selectedDate = value;
      if (value) { this.dateSelected(); }
    });

    this.actionDialog = this.data.action === "add" ? true : false;

    if (this.data.action === 'add') {
      if (this.data.calendar !== undefined) {
        this.bookForm.get('booked_date')?.setValue(this.data.data.date);
      }

    } else {
      this.data.data.booked_date = moment(this.data.data.booked_date).format("yyyy-MM-DDTHH:mm:ss");
      let timedate_parsed = moment(this.data.data.booked_date).format("yyyy-MM-DDTHH:mm:ss");
      this.bookForm.get('booked_date')?.setValue(timedate_parsed);

      this.bookForm.get('mem_id')?.setValue(this.data.mem_id);

      this.bookingPax = this.data.data.book_pax === 1;
      this.servicePax = this.data.sub === 'timegrid' ? this.data.data.book_pax > 0 : this.data.data.total_pax > 0;
      this.getServices(this.data.data.branch_id);
      this.getBookingList(this.data.data.book_guest_id);
      this.patchValues(this.data.data);
    }

    //  Chips Filter Function
    this.filteredServices = this.serviceCtrl.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value)),
      map(name => (name ? this._filter(name) : this.services.slice())),
    );

    this.filteredOptionsTherapist = this.myTherapistControl.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value.mem_name)),
      map(name => (name ? this._filterTherapist(name) : this.members.slice())),
    );

    this.bookForm.get('branch_id')?.valueChanges.subscribe((val: any) => {
      this.selectedBranch = val;
      this.getServices(val);
      this.getMembers(val);
    })

    this.generateTime();

    if (this.userRole === 'super-admin') {
      this.getBranches();
    } else {
      this.currentBranch = this.main.getCurrentUserBranch();
      this.bookForm.get('branch_id')?.setValue(this.currentBranch);
      this.getServices(this.currentBranch);
      this.getTBA(this.currentBranch);
    }
    this.getRooms();
    this.getDiscounts();
    this.getCustomers();

    this.bookForm.get('disc_id')?.valueChanges.subscribe((value: any) => {
      if (value) { this.getPercentDiscount(value) }
    });

    this.bookForm.get('mode_of_payment')?.valueChanges.subscribe((value: any) => {
      if (value !== 'gc') {
        this.gcAmount = null;
        this.checkSelectedServices();
      }
    });

    this.bookForm.get('branch_id')?.valueChanges.subscribe((value: any) => {
      if (value) {
        this.getTBA(value);
      }
    });

    this.bookForm.get('room_id')?.valueChanges.subscribe((value: any) => {
      if (value) {
        this.getRoomByRoomId(value);
      }
    });
    if (this.data.action === 'add' && this.data.sub === 'timegrid') {
      let arr = moment(this.data.date).format("yyyy-MM-DD");
      this.bookForm.get('booked_date')?.setValue(arr);
      this.bookForm.get('mem_id')?.setValue(this.data.mem_id);
    }
  }

  private __filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.customer.filter((cust: any) => cust.cus_name.toLowerCase().includes(filterValue));
  }

  customerSelection(data: any) {
    this.bookForm.get('book_guest_name')?.setValue(data.cus_name);
    this.bookForm.get('book_guest_id')?.setValue(data.cus_id);
    this.bookForm.get('book_guest_number')?.setValue(parseFloat(data.cus_no));
  }
  getCustomers() {
    this.cus.getCustomers().subscribe((result: any) => {
      this.customer = result.success ? result.response : [];
    })
  }

  getTBA(branch: any) {
    this.mem.getTBA({ data: branch }).subscribe((res: any) => {
      this.TBA = res.success ? res.response : [];
    })
  }

  calculateGc() {
    if (this.gcAmount) {
      let x = this.bookForm.controls['total_price']?.value - this.gcAmount;
      this.bookForm.get('total_price')?.setValue(x);
    }
  }

  selectedServiceChange() {
    if (this.discountPercentage === 0) {
      this.selectedServiceForDiscount = 0;
    }
    this.checkSelectedServices();
  }

  checkSelectedServices() {
    if (this.filteredService.length > 0) {
      let total = 0;
      for (let i = 0; i < this.filteredService.length; i++) {
        if (this.filteredService[i].service_id === this.selectedServiceForDiscount) {
          this.filteredService[i].disc_id = this.filteredService[i].disc_id || 0;
          this.filteredService[i].disc_percent = this.filteredService[i].disc_percent || 0;
          this.filteredService[i].disc_id = this.discountID;
          this.filteredService[i].disc_percent = this.discountPercentage;
          let y = this.filteredService[i].service_price * this.discountPercentageDecimal;
          let sum = this.filteredService[i].service_price - y;
          this.filteredService[i].service_total = sum ? sum : this.filteredService[i].service_price;
        } else {
          this.filteredService[i].disc_id = 0;
          this.filteredService[i].disc_percent = 0;
          this.filteredService[i].service_total = this.filteredService[i].service_price;
        }
        total += this.filteredService[i].service_total;
      }

      if (this.gcAmount) {
        total = total - this.gcAmount;
      }

      this.bookForm.get("total_price")?.setValue(total);
    }
  }

  getExtraTime(x: any) {
    this.main.getExtraTime({ data: x }).subscribe((res: any) => {
      this.extraTime = res.success ? res.response[0].et_time : ''
    })
  }

  getPercentDiscount(a: any) {
    if (a === 0) {
      this.selectedServiceForDiscount = 0;
    }
    this.main.getPercentDiscount({ data: a }).subscribe((res: any) => {
      if (res.success) {
        this.discountID = a;
        this.discountPercentage = res.response.length > 0 ? res.response[0].disc_percent : 0;
        this.discountPercentageDecimal = this.discountPercentage / 100;
        this.checkSelectedServices();
      }
    })
  }

  getDiscounts() {
    this.main.getDiscounts({ data: '' }).subscribe((res: any) => {
      this.discounts = res.success ? res.response : [];
    })
  }

  patchValues(data: any) {
    this.bookForm = this.fb.group({
      book_pax_id: [data.book_pax_id],
      book_guest_id: [data.book_guest_id],
      book_id: [data.book_id],
      disc_id: [data.disc_id || '0'],
      price: [data.price],
      total_price: [data.total_price],
      mode_of_payment: [data.mode_of_payment],
      branch_id: [data.branch_id],
      mem_id: [data.mem_id],
      service_id: [this.servicePax ? '' : data.service_id],
      room_id: [data.room_id],
      room_pax_status: [data.room_pax_status],
      book_guest_name: [this.data.action === 'arrival-single' ? data.book_guest_name : ''],
      book_guest_number: [data.book_guest_number],
      booked_date: [data.booked_date],
      booked_status: [data.booked_status],
      book_pax: [data.book_pax],
      time_start: [this.main.convertTime24to12(data.time_start)],
      time_end: [data.time_end],
      booked_by: [this.userId],
      notes: [data.notes],
    });
    this.selectedServiceForDiscount = data.service_id;
    this.getServices(data.branch_id);
    this.getPercentDiscount(data.disc_id);
    this.getMembers(data.branch_id);
    this.getMembersById(data.mem_id);
  }


  generateTime() {
    this.times = [
      { val_name: '10:00 AM', val_status: false, val: 10 },
      { val_name: '11:00 AM', val_status: false, val: 11 },
      { val_name: '12:00 PM', val_status: false, val: 12 },
      { val_name: '1:00 PM', val_status: false, val: 1 },
      { val_name: '2:00 PM', val_status: false, val: 2 },
      { val_name: '3:00 PM', val_status: false, val: 3 },
      { val_name: '4:00 PM', val_status: false, val: 4 },
      { val_name: '5:00 PM', val_status: false, val: 5 },
      { val_name: '6:00 PM', val_status: false, val: 6 },
      { val_name: '7:00 PM', val_status: false, val: 7 },
      { val_name: '8:00 PM', val_status: false, val: 8 },
      { val_name: '9:00 PM', val_status: false, val: 9 },
      { val_name: '10:00 PM', val_status: false, val: 10 },
      { val_name: '11:00 PM', val_status: false, val: 11 },
      { val_name: '12:00 AM', val_status: false, val: 12 },
    ];
  }

  getBookingList(id: any) {
    this.book.getClientsBookingAndDate({ data: this.data.data.book_guest_id, date: this.data.sub  }).subscribe((res: any) => {
      if (res.success) {
        res.response.forEach((e: any) => {
          if (this.servicePax && e.service_id !== 0) {
            this.filteredService.push({
              service_name: e.service_name,
              service_id: e.service_id,
              service_price: e.service_price,
              disc_id: e.disc_id,
              disc_percent: e.disc_percent,
              service_dur: e.service_dur
            });
          } else if (e.service_id !== 0) {
            this.filteredService.push({
              service_name: e.service_name,
              service_id: e.service_id,
              service_price: e.service_price,
              disc_id: e.disc_id,
              disc_percent: e.disc_percent,
              service_dur: e.service_dur
            });
          }
        });
      }
    })
  }

  getLatestBookPaxId() {
    this.book.getLatestBookPaxId().subscribe((res: any) => {
      this.latestBookPax = res.success ? res.response[0].book_pax_id : [];
    })
  }

  getBranches() {
    this.main.getBranches().subscribe((res: any) => {
      this.branches = res.success ? res.response : [];
    })
  }

  getServices(id: any) {
    this.main.getServiceByBranchId({ data: id }).subscribe((res: any) => {
      this.services = res.success ? res.response : [];
    })
  }

  getMembers(x: any) {
    this.mem.getAvailabilityByBranch({ data: x }).subscribe((res: any) => {
      this.members = res.success ? res.response : [];
    })
  }

  getMembersById(id: any) {
    this.mem.getMemberById({ data: id }).subscribe((res: any) => {
      if (res.success) {
        this.restricted = res.response.length > 0 ? res.response[0].mem_restricted : false;
      }
    });
  }

  getRoomByRoomId(id: any) {
    this.main.getRoomByRoomId({ data: id }).subscribe((res: any) => {
      this.roomSelectedData = res.success ? res.response : [];
      if (this.roomSelectedData.length > 0) {
        this.bookForm.get("room_pax_status")?.setValue(this.roomSelectedData[0].room_pax_status)
      }
    });
  }

  getRooms() {
    this.main.getAllRooms().subscribe((res: any) => {
      this.rooms = res.success ? res.response : [];
    })
  }

  async dateSelected() {
    const result1 = <any>await this.getAvailableServices();
    const result2 = <any>await this.getHoursAvailable(result1);
    const result3 = <any>await this.compareTwoArrays(this.times, result2);
    const result4 = <any>await this.changeTimeStatus(result3);

    if (result4 === false) {
      // No Booking Record
      this.generateTime();
      this.getMembers(this.currentBranch);
    } else {
      this.getAvailableMembers();
      // With Booking Record

    }
  }

  getAvailableServices() {
    return new Promise(resolve => {
      if (this.userRole === 'super-admin') {
        if (this.selectedBranch) {
          this.main.getAvailableServicesInformation({ date: this.bookForm.get('booked_date')?.value, id: this.selectedBranch }).subscribe((res: any) => {
            this.bookings = res.success ? res.response : [];
            resolve(this.bookings);
          });
        } else {
          resolve(false);
          this.main.snackbar('Please select a branch first.', 'X', 2000, 'warn-panel');
        }
      } else {
        this.main.getAvailableServicesInformation({ date: this.bookForm.get('booked_date')?.value, id: this.currentBranch }).subscribe((res: any) => {
          this.bookings = res.success ? res.response : [];
          resolve(this.bookings);
        });
      }
    });
  }

  getHoursAvailable(data: any) {
    return new Promise(resolve => {
      if (data) {
        if (data.length > 0) {
          data.forEach((el: any) => {
            const time_booked = this.main.convertTime24to12(el.time_start);
            this.hours_booked.push(time_booked);
          });
          resolve(this.hours_booked);
        } else {
          resolve(false);
        }
      } else {
        resolve(false);
      }
    });
  }

  compareTwoArrays(arr1: any, arr2: any) {
    return new Promise(resolve => {
      if (arr2 !== false) {
        arr1.forEach((val1: any, i1: any) => {
          arr2.forEach((val2: any) => {
            if (val1.val_name === val2) {
              this.sameIndexes.push({ index: i1, time: val1.val_name });
            }
          });
        });
        resolve(true);
      } else {
        resolve(false);
      }
    });
  }

  changeTimeStatus(solve: any) {
    return new Promise(resolve => {
      if (solve) {
        this.sameIndexes.forEach((val: any) => {
          this.times.splice(val.index, 1, { val_name: val.time, val_status: true });
          resolve(this.times);
        })
      } else {
        resolve(false);
      }
    })
  }

  restrictedTherapist() {
    if (this.bookForm.get('mem_id')?.value === 0) {
      this.main.snackbar('Select a therapist.', 'X', 2000, 'warn-panel');
      this.restricted = false;
    } else {
      this.mem.updateMemberRestriction({ data: this.restricted, id: this.bookForm.get('mem_id')?.value }).subscribe((value: any) => {
        if (value.success) {
          this.main.snackbar(value.response, 'X', 2000, 'primary-panel');
        }
      })
    }
  }

  getAvailableMembers() {
    this.mem.getAvailabilityByBranch({ data: this.currentBranch }).subscribe((res: any) => {
      this.members = res.success ? res.response : [];
    })
  }

  serviceSelectionChange() {
    this.selectedService = this.filteredService;
    if (this.selectedService) {
      this.selectedService.forEach((el: any) => {
        let time_start;
        let time_end;

        const dur = el.service_dur;
        const time_start_slice = this.bookForm.get('time_start')?.value;
        var res = time_start_slice.replace(/\D/g, "");

        if (res) {
          if (res.length === 3) {
            time_start = res.slice(0, 1);
          } else if (res.length === 4) {
            time_start = res.slice(0, 2);
          }
        }

        time_end = parseInt(time_start) + parseInt(dur) + this.extraTime;
      })
    }
  }

  submit() {
    const date = moment(new Date()).format("YYYY-MM-DD");
    let arr_update: any = [];
    let arr_update_array: any = [];
    if (this.data.action === 'add' && this.data.sub === 'timegrid') {
      let start = moment(this.data.date, 'HH:mm:ss').format('HH:mm');
      this.bookForm.get('time_start')?.setValue(start);
    }
    if (this.bookForm.valid) {
      if (this.bookForm.get('time_start')?.value && this.data.sub !== 'timegrid') {
        const a = this.main.convertTime12To24(this.bookForm.get('time_start')?.value);
        this.bookForm.get('time_start')?.setValue(a);
      }

      if (this.actionDialog) {
        if (this.data.action === 'add' && this.data.sub === 'timegrid') {

          let time_start = this.bookForm.get('time_start')?.value;
          let start = moment(time_start, 'HH:mm:ss').format('HH:mm');
          let timeAndDate = moment(date + ' ' + start);
          let timedate_parsed = moment(timeAndDate).format("yyyy-MM-DDTHH:mm:ss");
          let minutes;
          let hour;

          let time_end_formatted;
          for (let i = 0; i < this.filteredService.length; i++) {
            let data = this.filteredService[i];
            if (i === 0) {
              hour = data.service_dur.split('.')[0] || 0;
              minutes = data.service_dur.split('.')[1] || 0;
              if (minutes !== 0) {
                minutes = parseFloat('.' + minutes) * 60;
              }

              let time_exta = minutes + this.extraTime;
              let time_start_formatted = moment(timedate_parsed).add(hour, 'hours').add(time_exta, 'minutes').format('LT'); // LT format for seconds 
              time_end_formatted = this.main.convertTime12To24(time_start_formatted);

              this.filteredService[i].time_start = time_start;
              this.filteredService[i].time_end = time_end_formatted;

              this.bookForm.get('time_end')?.setValue(time_end_formatted);
              this.bookForm.get('time_start')?.setValue(time_start);
            } else {
              hour = data.service_dur.split('.')[0] || 0;
              minutes = data.service_dur.split('.')[1] || 0;
              if (minutes !== 0) {
                minutes = parseFloat('.' + minutes) * 60;
              } 

              let end = moment(this.filteredService[i-1].time_end, 'HH:mm:ss').format('HH:mm');
              let timeAndDate = moment(date + ' ' + end);
              let timedate_parsed_end = moment(timeAndDate).format("yyyy-MM-DDTHH:mm:ss");
              let time_exta = minutes + this.extraTime;
              let time_parsed_array = moment(timedate_parsed_end).format("yyyy-MM-DDTHH:mm:ss");

              let time_start_formatted = moment(time_parsed_array).add(hour, 'hours').add(time_exta, 'minutes').format('LT'); // LT format for seconds 
              time_end_formatted = this.main.convertTime12To24(time_start_formatted);

              this.filteredService[i].time_start = this.filteredService[i-1].time_end;
              this.filteredService[i].time_end = time_end_formatted;

              this.bookForm.get('time_start')?.setValue(this.filteredService[i-1].time_end);
              this.bookForm.get('time_end')?.setValue(time_end_formatted);
            }
            
            this.bookForm.get('service_id')?.setValue(this.filteredService[i].service_id);
            this.bookForm.get("price")?.setValue(this.filteredService[i].service_total);
            arr_update.push(this.bookForm.getRawValue());
          }

          const count = this.filteredService.length || 0;
          let sum = 0;
          for (let i = 0; i < count; i++) {
              if (arr_update[i].service_id !== this.selectedServiceForDiscount) {
                  arr_update[i].disc_id = 0;
              }
              sum += arr_update[i].price;
              arr_update_array.push(arr_update[i]);
          }
          this.bookForm.get("total_price")?.setValue(sum);

        } else {
          this.bookForm.get('mem_id')?.setValue(this.TBA[0].mem_id);
        }

        this.book.addBookingsInTimeGrid({ data: arr_update }).subscribe((res: any) => {
          if (res.success) {
            this.main.snackbar(res.response, 'X', 2000, 'primary-panel');
            this.dialogRef.close(true);
          } else {
            this.main.snackbar('Booking Failed', 'X', 2000, 'warn-panel');
          }
        });
      } else {
        let time_start = this.bookForm.get('time_start')?.value;
        let start = moment(time_start, 'HH:mm:ss').format('HH:mm');
        let timeAndDate = moment(date + ' ' + start);
        let timedate_parsed = moment(timeAndDate).format("yyyy-MM-DDTHH:mm:ss");
        let minutes;
        let hour;

        this.filteredService.forEach((val: any) => {
          hour = val.service_dur.split('.')[0] || 0;
          minutes = val.service_dur.split('.')[1] || 0;
          if (minutes !== 0) {
            minutes = parseFloat('.' + minutes) * 60;
          }
        })
        let time_exta = minutes + this.extraTime;

        let time_start_formatted = moment(timedate_parsed).add(1, 'hours').add(time_exta, 'minutes').format('LT'); // LT format for seconds 
        let time_end_formatted = this.main.convertTime12To24(time_start_formatted);

        let arr = moment(this.bookForm.get('booked_date')?.value).format("yyyy-MM-DD");
        // this.bookForm.get('time_end')?.setValue(arr);        
        this.filteredService.forEach((el: any) => {
          this.bookForm.get('service_id')?.setValue(el.service_id);
          this.bookForm.get("price")?.setValue(el.service_total);
          this.bookForm.get('booked_date')?.setValue(arr)
          arr_update.push(this.bookForm.getRawValue());
        });

        const count = this.filteredService.length || 0;
        let sum = 0;
        for (let i = 0; i < count; i++) {
          if (arr_update[i].service_id !== this.selectedServiceForDiscount) {
            arr_update[i].disc_id = 0;
          }
          sum += arr_update[i].price;
          arr_update_array.push(arr_update[i]);
        }

        this.bookForm.get("total_price")?.setValue(sum);
        if (this.filteredService.length > 0) {
          this.book.updateMoreServiceBooking({ data: arr_update_array, id: this.bookForm.get('book_guest_id')?.value, member: this.bookForm.get('mem_id')?.value }).subscribe((res: any) => {
            if (res.success) {
              this.main.snackbar(res.response, 'X', 2000, 'primary-panel');
              this.dialogRef.close({ success: true, data: this.bookForm.get('mem_id')?.value, array: arr_update_array });
            } else {
              this.main.snackbar('Booking Update Failed', 'X', 2000, 'warn-panel');
            }
          });
        } else {
          this.book.removeAllServiceUpdateBooking({ data: this.bookForm.getRawValue(), id: this.bookForm.get('book_guest_id')?.value, book_id: this.bookForm.get('book_id')?.value }).subscribe((res: any) => {
            if (res.success) {
              this.main.snackbar(res.response, 'X', 2000, 'primary-panel');
              this.dialogRef.close({ success: true, data: this.bookForm.get('mem_id')?.value, array: this.bookForm.getRawValue() });
              // this.dialogRef.close({success: true, data: this.bookForm.get('mem_id')?.value, array: this.data.data});
            } else {
              this.main.snackbar('Booking Update Failed', 'X', 2000, 'warn-panel');
            }
          })
        }
      }
    } else {
      this.main.snackbar('Please complete the forms.', 'X', 2000, 'warn-panel');
    }
  }

  submitGuestForm() {
    if (this.bookForm.valid) {
      let arr_update: any = [];
      let arr_update_array: any = [];
      const a = moment(this.bookForm.get('booked_date')?.value).add(1, 'days');
      this.bookForm.get('booked_date')?.setValue(a);
      this.bookForm.get('book_guest_id')?.setValue(this.bookForm.get('book_guest_id')?.value + 1);

      this.filteredService.forEach((el: any) => {
        this.bookForm.get('service_id')?.setValue(el.service_id);
        arr_update.push(this.bookForm.getRawValue());
      });

      const count = this.filteredService.length || 0;
      for (let i = 0; i < count; i++) {
        arr_update_array.push(arr_update[i]);
      }

      if (this.filteredService.length > 0) {
        this.book.addGuestBooking({ data: arr_update_array }).subscribe((res: any) => {
          if (res.success) {
            this.main.snackbar(res.response, 'X', 2000, 'primary-panel');
            this.bookForm.reset();
            this.dialogRef.close();
          } else {
            this.main.snackbar('Booking Failed', 'X', 2000, 'warn-panel');
          }
        })
      } else {
        this.main.snackbar('Select a service in order to complete the forms.', 'X', 2000, 'warn-panel');
      }
    } else {
      this.main.snackbar('Please complete the forms.', 'X', 2000, 'warn-panel');
    }
  }

  /*----------------------------------
               Form Array
  -----------------------------------*/

  get servicesForms() {
    return this.servicesFormGroup.get('services') as FormArray;
  }

  addServices(): void {
    this.servicesArray = this.servicesFormGroup.get('services') as FormArray;
    this.servicesArray.push(this.createServices());
  }

  createServices(): FormGroup {
    return this.fb.group({
      room_id: [''],
      service_id: [''],
      mem_id: [''],
      book_guest_name: [''],
    });
  }

  removeService(index: number) {
    this.servicesArray = this.servicesFormGroup.get('services') as FormArray;
    this.servicesArray.removeAt(index);
  }


  /*----------------------------------
               Chips
  -----------------------------------*/

  addinServiceArray(event: MatChipInputEvent, i: any): void {
    const value = (event.value || '').trim();
    if (value) {
      this.filteredServiceArray.push(value);
    }
    event.chipInput!.clear();
    this.serviceCtrl.setValue(null);
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value.length < 0) {
      this.filteredService.push(value);
    }
    event.chipInput!.clear();
    this.serviceCtrl.setValue(null);
  }

  remove(fruit: string): void {
    const index = this.filteredService.indexOf(fruit);
    if (index >= 0) {
      this.filteredService.splice(index, 1);
      this.checkSelectedServices();
    }
  }

  removeServiceArray(fruit: string): void {
    const index = this.filteredServiceArray.indexOf(fruit);
    if (index >= 0) {
      this.filteredServiceArray.splice(index, 1);
    }
  }

  selectedinServiceArray(event: MatAutocompleteSelectedEvent, i: any): void {
    this.filteredServiceArray.push(event.option.value);
    this.serviceInput.nativeElement.value = '';
    this.serviceCtrl.setValue(null);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.filteredService.push(event.option.value);
    this.serviceInput.nativeElement.value = ''; -
      this.serviceCtrl.setValue(null);
    this.checkSelectedServices();
  }



  private _filter(value: any) {
    let filterValue = '';
    if (value) {
      filterValue = value.length === undefined ? value.service_name.toLowerCase() : value.toLowerCase();
    }
    return this.services.filter((name: any) => name.service_name.toLowerCase().includes(filterValue));
  }

  displayFn(item: any): string {
    return item && item ? item.mem_name : '';
  }



  private _filterTherapist(value: any): any[] {
    const filterValue = value.length === undefined ? value.mem_name.toLowerCase() : value.toLowerCase();
    return this.members.filter((member: any) => member.mem_name.toLowerCase().includes(filterValue));
  }



}