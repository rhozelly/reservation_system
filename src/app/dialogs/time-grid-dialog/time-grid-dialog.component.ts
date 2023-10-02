import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { BookingsService } from 'src/app/core/services/bookings.service';
import { MainService } from 'src/app/core/services/main.service';
import { MemberService } from 'src/app/core/services/member.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { map, Observable, startWith } from 'rxjs';
import { MatChipInputEvent } from '@angular/material/chips';
import * as moment from 'moment';

@Component({
  selector: 'app-time-grid-dialog',
  templateUrl: './time-grid-dialog.component.html',
  styleUrls: ['./time-grid-dialog.component.css']
})
export class TimeGridDialogComponent implements OnInit {
  details: any = [];
  detail: any = [];
  members: any = [];
  therapist: any = [];
  bookForm!: FormGroup;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  serviceCtrl = new FormControl();
  filteredServices!: Observable<any[]>;
  filteredService: any = [];
  services: any = [];
  discounts: any  =[];
  rooms: any = [];
  times: any = [];
  discountPercentage: any = 0;
  selectedServiceForDiscount: any = 0;
  modes: any = ['cash', 'credit card', 'debit card', 'gcash'];
  marked: any = ['Pending', 'Arrived', 'No Show', 'Completed', 'Cancelled', 'Spa Party', 'Home Service'];
  userId: any;
  currentMemId: any;
  markedStatus: any = '';
  clientSelected: any = [];
  stats: any = 0;

  constructor(
    public dialogRef: MatDialogRef<TimeGridDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private main: MainService,
    private fb: FormBuilder,
    private book: BookingsService,
    private mem: MemberService) { }

  ngOnInit(): void {
    this.userId = this.main.getCurrentUserAccId();  
    const id = this.main.getCurrentUserBranch();
    this.bookForm = this.fb.group({
      branch_id: [{ value: '', disabled: true }],
      book_guest_id: [{ value: '', disabled: true }],
      // book_pax_id: [this.latestBookPax || 0],
      mem_id: [{ value: '', disabled: true },],
      // disc_id: [{value: '0', disabled: true}],
      // price: [{ value: '', disabled: true },],
      // total_price: [{ value: '', disabled: true },],
      // mode_of_payment: [{ value: '', disabled: true },],
      service_id: [{ value: '', disabled: true },],
      book_id: [{ value: '', disabled: true },],
      room_id: [{value: 0, disabled: true}],
      book_guest_name: [{ value: '', disabled: true }],
      book_guest_number: [{ value: '', disabled: true }],
      booked_date: [{ value: '', disabled: true }],
      booked_status: [{value: 0, disabled: true}],
      book_pax: [{ value: '', disabled: true }],
      time_start: [{ value: '', disabled: true }],
      time_end: [{ value: '', disabled: true },],
      booked_by: [this.userId],   
      notes: [{ value: '', disabled: true },],  
    });

    this.getClient();
    this.getMembers(id);
    this.getServices(id);
    this.getDiscounts();
    this.generateTime();
    this.getRooms();
    
    this.filteredServices = this.serviceCtrl.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value)),
      map(name => (name ? this._filter(name) : this.services.slice())),
    );
    this.getClientsBookingAndDate(this.data);
  }

  
  generateTime(){
    this.times = [
      {val_name: '7:00 AM', val_status: false, val: 7 },
      {val_name: '8:00 AM', val_status: false, val: 8 },
      {val_name: '9:00 AM', val_status: false, val: 9 },
      {val_name: '10:00 AM', val_status: false, val: 10 },
      {val_name: '11:00 AM', val_status: false, val: 11 },
      {val_name: '12:00 PM', val_status: false, val: 12 },
      {val_name: '1:00 PM', val_status: false, val: 1 },
      {val_name: '2:00 PM', val_status: false, val: 2 },
      {val_name: '3:00 PM', val_status: false, val: 3 },
      {val_name: '4:00 PM', val_status: false, val: 4 },
      {val_name: '5:00 PM', val_status: false, val: 5 },
      {val_name: '6:00 PM', val_status: false, val: 6 },
      {val_name: '7:00 PM', val_status: false, val: 7 },
      {val_name: '8:00 PM', val_status: false, val: 8 },
      {val_name: '9:00 PM', val_status: false, val: 9 },
      {val_name: '10:00 PM', val_status: false, val: 10 },
      {val_name: '11:00 PM', val_status: false, val: 11 },
      {val_name: '12:00 PM', val_status: false, val: 12 },
      {val_name: '1:00 AM', val_status: false, val: 1 },
      {val_name: '2:00 AM', val_status: false, val: 2 },
      {val_name: '3:00 AM', val_status: false, val: 3 },
      {val_name: '4:00 AM', val_status: false, val: 4 },
      {val_name: '5:00 AM', val_status: false, val: 5 },
      {val_name: '6:00 AM', val_status: false, val: 6 },
    ];
  }

  getClientsBookingAndDate(data: any){
    this.book.getClientsBookingAndDate({data: data.id, date: data.date}).subscribe((res: any) =>{
      if(res.success){
        this.clientSelected = res.response.length > 0 ? res.response[0] : [];
        this.stats = this.clientSelected.booked_status;
        console.log(this.clientSelected.booked_status);
        
        this.markedStatus = 
        this.clientSelected.booked_status === 0 ? "Pending" :
        this.clientSelected.booked_status === 1 ? "Completed" :
        this.clientSelected.booked_status === 2 ? "Cancelled" :
        this.clientSelected.booked_status === 3 ? "Arrived" :
        this.clientSelected.booked_status === 4 ? "Spa Party" :
        this.clientSelected.booked_status === 5 ? "Home Service" :
        this.clientSelected.booked_status === 6 ? "No Show" :  '';
      }
    })
  }

  savedMarked(){
      let stats = 
      this.markedStatus === "Pending" ? 0 :
      this.markedStatus === "Completed" ? 1 :
      this.markedStatus === "Cancelled" ? 2 :
      this.markedStatus === "Arrived" ? 3 :
      this.markedStatus === "Spa Party" ? 4 :
      this.markedStatus === "Home Service" ? 5 : 
      this.markedStatus === "No Show" ? 6 : 0;
    if(stats === 3 && this.clientSelected.room_id === 0){
      this.main.snackbar('Please update room first before marking it arrived', 'X', 2500, 'warn-panel');
    } else {      
      this.book.updateBookingByGuestIdAndDate({data: {booked_status: stats}, id: this.clientSelected.book_guest_id, date: this.clientSelected.booked_date}).subscribe((res: any) =>{
        if(res.success){          
            let room;  
            if(this.clientSelected.room_id > 0 && stats === 3){
              let rps_format;

              if(this.clientSelected.room_pax_status){
                const rps = this.clientSelected.room_pax_status.split(',');
                rps_format = this.loopData(rps, '0');
              } else {
                rps_format = null;
              }
              room = {
                room_status: 0,
                room_pax_status: rps_format,
                room_id: this.clientSelected.room_id
              }
              this.main.updateRoom({data: room}).subscribe((resu: any) =>{
                  this.main.snackbar(resu.response, 'X', 2000, 'primary-panel');
              })
            } else {
              let rps_format;
              if(this.clientSelected.room_pax_status){
                const rps = this.clientSelected.room_pax_status.split(',');
                rps_format = this.loopData(rps, '1');
              } else {
                rps_format = null;
              }
              room = {
                room_status: 1,
                room_pax_status: rps_format,
                room_id: this.clientSelected.room_id
              }
              this.main.updateRoom({data: room}).subscribe((resu: any) =>{
                this.main.snackbar(resu.response, 'X', 2000, 'primary-panel');
              })
            }  
            if(stats === 3){
              // this.moveTolastPosition(el);
            } 
            this.dialogRef.close({success: true, data: this.therapist});
            if(stats === 4 || stats === 5){

            }
        } else {        
            this.main.snackbar('Update booking status failed!', 'X', 2000, 'red-panel');
        }
      })

      let total = this.clientSelected.total_services ? this.clientSelected.total_services : 0;
      let id = this.clientSelected.mem_id ? this.clientSelected.mem_id : 0;  
      let op = stats === 1 ? '+' : '-';
      this.mem.updateTotalMemberServices({data: total, id: id, operator: op}).subscribe((opResult: any) =>{
        if(opResult.success){
          this.main.snackbar('Service calculated', 'X', 2000, 'primary-panel');
        }
      })
    }
  }
  loopData(y: any, bool: any){
    let to = bool === '0' ? '1' : '0';
    let new_index: any = [];       
    const index = y.findIndex((val: any) => val.toString() === to);
    if(index > -1){
      y[index] = bool;
    } else {
      y[0] = bool;
    }
    return new_index = y.join(',')
  }
  private _filter(value: any) {  
    let filterValue = '';    
      if(value){
        filterValue = value.length === undefined ? value.service_name.toLowerCase() : value.toLowerCase();
      } 
      return this.services.filter((name: any) => name.service_name.toLowerCase().includes(filterValue));
  }

  displayFn(item: any): string {    
    return item && item ? item.mem_name : '';
  }
  
  getServices(id: any){    
    this.main.getServiceByBranchId({data: id}).subscribe((res: any ) => {
      this.services = res.success ? res.response : [];      
      this.filteredServices = res.success ? res.response : [];      
    })
  }

  getDiscounts(){
    this.main.getDiscounts({data: ''}).subscribe((res: any) =>{
      this.discounts = res.success ? res.response : [];      
    })
  }

  getRooms(){
    this.main.getRooms({size:'', index: -1, search:''}).subscribe((res: any ) => {
        this.rooms = res.success ? res.response : [];
    })
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
    }
  }

  getClient(){
    this.book.getClientsWithConcatBooking({data: this.data.id}).subscribe((res: any) =>{
      if(res.success) {        
        if(res.response.length > 0) {            
          this.detail = res.response[0] || [];
          this.details = res.response || [];
          this.details.forEach((e: any) =>{      
              this.filteredService.push({service_name: e.services_name, service_id: e.service_id, disc_id: e.disc_id, disc_percent: e.disc_percent});
              this.currentMemId = e.mem_id;
          });        
          this.patchValues(this.detail);
        }
      }      
    })
  }

  getMembers(x: any){
    this.mem.getAvailabilityByBranch({data: x}).subscribe((res: any ) => {
        this.members = res.success ? res.response : [];
    })
  }

  transfer(){
    this.book.transferBooking({data: {mem_id: this.therapist}, book_id:this.data.group_id, old_mem: this.detail.mem_id}).subscribe((res: any) =>{
      if(res.success){
        this.main.snackbar('Booking was successfully transfered', 'X', 2000, 'primary-panel');
        this.dialogRef.close({success: true, data: this.therapist})
      } else {          
        this.main.snackbar('Updating Booking Failed', 'X', 2000, 'warn-panel');
        this.dialogRef.close({success: false})
      }
    });
  }

  
  patchValues(data: any){    
    this.bookForm = this.fb.group({
      book_pax_id: [{ value: data.book_pax_id, disabled: true}],
      book_guest_id: [{ value: data.book_guest_id, disabled: true}],
      book_id: [{ value: data.book_id, disabled: true}],
      // disc_id: [{ value: data.disc_id || '0', disabled: true}],
      // price: [{ value: data.price, disabled: true}],
      // total_price: [{ value: data.total_price, disabled: true}],
      // mode_of_payment: [{ value: data.mode_of_payment, disabled: true}],
      branch_id: [{ value: data.branch_id, disabled: true}],
      mem_id: [{ value: data.mem_id, disabled: true}],
      service_id: [{ value: data.service_id, disabled: true}],
      room_id: [{ value: data.room_id, disabled: true}],
      book_guest_name: [{value: data.book_guest_name, disabled: true}],
      book_guest_number: [{ value: data.book_guest_number, disabled: true}],
      booked_date: [{ value: data.booked_date, disabled: true}],
      booked_status: [{ value: data.booked_status, disabled: true}],
      book_pax: [{ value: data.book_pax, disabled: true}],
      time_start: [{value: this.main.convertTime24to12(data.time_start), disabled: true}],
      // time_end: [data.time_end],
      // booked_by: [this.userId],
      notes: [{value: data.notes, disabled: true}],
    });
    // this.selectedServiceForDiscount = data.service_id;
    // this.getServices(data.branch_id);
    // this.getPercentDiscount(data.disc_id);
    this.getMembers(data.branch_id);  
  }


}
