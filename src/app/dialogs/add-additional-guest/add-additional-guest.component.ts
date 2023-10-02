
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, Observable, startWith } from 'rxjs';
import { BookingsService } from 'src/app/core/services/bookings.service';
import { MainService } from 'src/app/core/services/main.service';
import { MemberService } from 'src/app/core/services/member.service';
import * as moment from 'moment';
import { LoginComponent } from 'src/app/components/login/login.component';

@Component({
  selector: 'app-add-additional-guest',
  templateUrl: './add-additional-guest.component.html',
  styleUrls: ['./add-additional-guest.component.css']
})
export class AddAdditionalGuestComponent implements OnInit {
  additionalBookForm!: FormGroup;
  picked: any = [];
  currentBranch: any = [];
  userRole: any = [];
  branches: any = [];
  services: any = [];
  members:  any = [];
  clients:  any = [];
  rooms:  any = [];
  times: any = [];

  clientsModel: any = [];
  
  disableSelection: any = null;

  serviceControl = new FormControl();
  autocompleteServices!: Observable<any[]>;
  autocompleteService: any = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  @ViewChild('serviceInput') serviceInput!: ElementRef<HTMLInputElement>;  

  clientControl = new FormControl();
  autocompleteClients!: Observable<any[]>;
  autocompleteClient: any = [];
  @ViewChild('clientInput') clientInput!: ElementRef<HTMLInputElement>;  
  extraTime: any = 0;
  book_guest_id: any = [];
  
  constructor(
        public dialogRef: MatDialogRef<AddAdditionalGuestComponent>,
        @Inject(MAT_DIALOG_DATA) public dialogData: any,
        private fb: FormBuilder,
        private main: MainService,
        private book: BookingsService,
        private mem: MemberService,
  ) { }

  ngOnInit(): void {    
    this.userRole = this.main.getCurrentUserPrivileges(); 
    this.currentBranch = this.main.getCurrentUserBranch(); 
    this.getExtraTime(this.main.getCurrentUserBranch());
    this.generateTime();
    this.getBranches();
    this.getRooms();
    this.getClients();
    this.getMembers(this.currentBranch);
    this.getServices(this.currentBranch);
    this.getMaxBookedGuestId();

    this.additionalBookForm = this.fb.group({
      branch_id: ['', Validators.required],
      book_guest_id: [''],
      book_pax_id: [''],
      mem_id: ['', Validators.required],
      service_id: [''],
      book_pax_selection: [''],
      room_id: [0],
      book_guest_name: ['', Validators.required],
      book_guest_number: ['', Validators.required],
      booked_date: ['', Validators.required],
      booked_status: [0],
      book_pax: ['', Validators.required],
      time_start: ['', Validators.required],
      time_end: [''],
      booked_by: [this.main.getCurrentUserAccId()],      
    })
    this.additionalBookForm.controls['booked_date'].disable();
    this.additionalBookForm.controls['time_start'].disable();
    this.additionalBookForm.controls['book_guest_number'].disable();
    
    
    
    this.autocompleteServices = this.serviceControl.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value)),
      map(name => (name ? this._filter(name, 'service') : this.services.slice())),
    );
    this.autocompleteClients = this.additionalBookForm.get('book_pax_selection')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value, 'client')),
    );

      this.additionalBookForm.get('book_pax_selection')?.valueChanges.subscribe((value: any) =>{  
        if(value){  
            this.picked = value;
        }        
    })
  }  

  getExtraTime(x: any){
    this.main.getExtraTime({data: x}).subscribe((res: any)=>{
      this.extraTime = res.success ? res.response[0].et_time : ''
    })
  }


  /*-----------------------------------------------------
                    Initiate Functions
  ------------------------------------------------------*/    
  
  
 generateTime(){
   this.times = [
    //  {val_name: '7:00 AM', val_status: false, val: 7 },
    //  {val_name: '8:00 AM', val_status: false, val: 8 },
    //  {val_name: '9:00 AM', val_status: false, val: 9 },
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
     {val_name: '12:00 AM', val_status: false, val: 12 },
    //  {val_name: '1:00 AM', val_status: false, val: 1 },
    //  {val_name: '2:00 AM', val_status: false, val: 2 },
    //  {val_name: '3:00 AM', val_status: false, val: 3 },
    //  {val_name: '4:00 AM', val_status: false, val: 4 },
    //  {val_name: '5:00 AM', val_status: false, val: 5 },
    //  {val_name: '6:00 AM', val_status: false, val: 6 },
   ];
 }

getBranches(){
   this.main.getBranches().subscribe((res: any ) => {
     this.branches = res.success ? res.response : [];
   })
}
getServices(id: any){    
   this.main.getServiceByBranchId({data: id}).subscribe((res: any ) => {
     this.services = res.success ? res.response : [];      
   })
}
getMembers(x: any){
   this.mem.getAvailabilityByBranch({data: x}).subscribe((res: any ) => {
       this.members = res.success ? res.response : [];
   })
}
getClients(){
   this.book.getAllClientsName().subscribe((res: any ) => {
       this.clients = res.success ? res.response : [];
   })
}
getRooms(){
  this.main.getRooms({size:'', index: -1, search:''}).subscribe((res: any ) => {
      this.rooms = res.success ? res.response : [];
  })
}

getMaxBookedGuestId(){
  this.book.getMaxOfColumn({data: 'book_guest_id'}).subscribe((result: any) =>{
    if(result.success){
      this.book_guest_id = result.response.length > 0 ? result.response[0].max : 0;   
    }
  })
}

/*-----------------------------------------------------
                    APIS
------------------------------------------------------*/

arrived(){
  let book_guest_id = 0;
  const date = moment(new Date()).format("YYYY-MM-DD");
  let arr_update:   any = [];
  let arr_update_array = [];  
  if(this.additionalBookForm.valid){
    if(this.additionalBookForm.get('booked_date')?.value){
      const a = moment(this.additionalBookForm.get('booked_date')?.value).add(1, 'days');
      this.additionalBookForm.get('booked_date')?.setValue(a);        
    } 
    let x = this.book_guest_id  + 1;
    this.additionalBookForm.get("book_guest_id")?.setValue(x);
    
    
    let time_start = this.additionalBookForm.get('time_start')?.value;

    let start = moment(time_start, 'HH:mm:ss').format('HH:mm');
    let timeAndDate = moment(date + ' ' + start);    
    let timedate_parsed = moment(timeAndDate).format("yyyy-MM-DDTHH:mm:ss");
    let minutes;
    let hour;

    this.autocompleteService.forEach((val: any) =>{
      hour = val.service_dur.split('.')[0] || 0;
      minutes = val.service_dur.split('.')[1] || 0;
      if(minutes !== 0){
        minutes = parseFloat('.'+ minutes) * 60;
      } 
    });

    let time_exta = minutes + this.extraTime;
    let time_start_formatted = moment(timedate_parsed).add(1, 'hours').add(time_exta, 'minutes').format('LT'); // LT format for seconds 
    this.additionalBookForm.get('time_end')?.setValue(time_start_formatted);  

    const count = this.autocompleteService.length || 0; 
    this.autocompleteService.forEach((el: any) =>{     
      this.additionalBookForm.get('service_id')?.setValue(el.service_id); 
      arr_update.push(this.additionalBookForm.getRawValue());
    });   

    for (let i = 0; i < count; i++) { arr_update_array.push(arr_update[i]); };
    
    if(arr_update_array.length > 0){
      this.book.addAdditionalBooking({data: arr_update_array, id: this.additionalBookForm.get('mem_id')?.value}).subscribe((res: any) =>{
          if(res.success){
            this.main.snackbar(res.response, 'X', 2000, 'primary-panel');
            this.dialogRef.close();
        } else {          
            this.main.snackbar('Booking Update Failed', 'X', 2000, 'warn-panel');
        }
      })
    } else {
      this.main.snackbar('Please select a service.', 'X', 2000, 'warn-panel');
    }
  } else {
    this.main.snackbar('Please complete the field.', 'X', 2000, 'warn-panel');
  }
}
  

linkGuest(data: any){
 
  // this.additionalBookForm.controls['book_guest_id'].disable();
  this.additionalBookForm = this.fb.group({
    branch_id: [data.branch_id],
    book_guest_id: [data.book_guest_id],
    book_pax_id: [data.book_pax_id],
    room_id: [''],
    service_id: [''],
    mem_id: ['',  Validators.required],
    book_guest_number: [data.book_guest_number],
    book_guest_name: [''],
    booked_status: [data.booked_status],
    booked_date: [data.booked_date, Validators.required],
    book_pax: [data.book_pax],
    time_start: [this.main.convertTime24to12(data.time_start)],
    time_end: [''],
    booked_by: [this.main.getCurrentUserAccId()],      
  })
}

unlinkGuest(){
  this.additionalBookForm = this.fb.group({
    branch_id: [''],
    book_guest_id: [''],
    book_pax_id: [''],
    room_id: [''],
    service_id: [''],
    mem_id: [''],
    book_guest_number: [''],
    book_guest_name: [''],
    booked_status: [''],
    booked_date: [''],
    book_pax: [''],
    time_start: [''],
    time_end: [''],
    booked_by: [''],      
  })
}



/*-----------------------------------------------------
                       Autocomplete
------------------------------------------------------*/
  
  private _filter(value: any, action: any) {   
    let filterValue = '';    
    if(action === 'service'){
        if(value){
          filterValue = value.length === undefined ? value.service_name.toLowerCase() : value.toLowerCase();
        } 
        return this.services.filter((name: any) => name.service_name.toLowerCase().includes(filterValue));
    } else {
        if(value){
          if(value.length === undefined){
            this.linkGuest(value);
          } 
          filterValue = value.length === undefined ? value.book_guest_name.toLowerCase() : value.toLowerCase();
        } 
        return this.clients.filter((name: any) => name.book_guest_name.toLowerCase().includes(filterValue));
    }
  }
  
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value.length < 0) {
      this.autocompleteService.push(value);
    }
    event.chipInput!.clear();
    this.serviceControl.setValue(null);
  }

  remove(service: string): void {
    const index = this.autocompleteService.indexOf(service);
    if (index >= 0) {
      this.autocompleteService.splice(index, 1);
    }
  }
  
  selected(event: MatAutocompleteSelectedEvent): void {    
    this.autocompleteService.push(event.option.value);
    this.serviceInput.nativeElement.value = '';
    this.serviceControl.setValue(null);
  }

  displayGuestName(user: any) {    
    return user && user.book_guest_name ? user.book_guest_name : '';
  }
  

}
