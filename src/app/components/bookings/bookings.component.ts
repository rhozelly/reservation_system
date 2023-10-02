  
  import { Calendar, CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
  import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
  import { MatDialog } from '@angular/material/dialog';
  import { AddBookingDialogComponent } from 'src/app/dialogs/add-booking-dialog/add-booking-dialog.component';
  import { BookingsService } from 'src/app/core/services/bookings.service';
  import { MatPaginator, PageEvent } from '@angular/material/paginator';
  import { MatTableDataSource } from '@angular/material/table';
  import { MainService } from 'src/app/core/services/main.service';
  import { AlertDialogComponent } from 'src/app/dialogs/alert-dialog/alert-dialog.component';
  import { MemberService } from 'src/app/core/services/member.service';
  import { AddAdditionalGuestComponent } from 'src/app/dialogs/add-additional-guest/add-additional-guest.component';
  import { FormControl } from '@angular/forms';
  import { map, Observable, startWith } from 'rxjs';
  import * as moment from 'moment';
  import interactionPlugin from '@fullcalendar/interaction';
  import resourceTimelinePlugin from '@fullcalendar/resource-timegrid';
  import { TimeGridDialogComponent } from 'src/app/dialogs/time-grid-dialog/time-grid-dialog.component';
  import tippy, {roundArrow} from 'tippy.js';
  import 'tippy.js/dist/svg-arrow.css';
  import 'tippy.js/animations/scale.css';
import { AccountService } from 'src/app/core/services/account.service';
import {HttpClient} from '@angular/common/http';
import { CustomerService } from 'src/app/core/services/customer.service';

  @Component({
    selector: 'app-bookings',
    templateUrl: './bookings.component.html',
    styleUrls: ['./bookings.component.css']
  })
  export class BookingsComponent implements OnInit { 
    @ViewChild('calendar') calendarComponent!: FullCalendarComponent;  
    @ViewChild('roomTimeGrid') roomTimeGridComponent!: FullCalendarComponent;  
    // Calendar
    @ViewChild('tabgroup') tabgroup?: ElementRef;
    dateNow: any = moment().format("MMMM DD, YYYY");
    initiateDate: any = moment().format("YYYY-MM-DD");
    calendarOptions: CalendarOptions  = {
      headerToolbar: {
        end: 'today'
      },
      timeZone: 'local',
      initialDate: this.initiateDate,
      initialView: 'resourceTimeGridDay',
      schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
      plugins: [ interactionPlugin, resourceTimelinePlugin  ],    
      slotMinTime: '10:00:00',
      slotMaxTime: '26:00:00',
      slotDuration: '00:15:00',
      allDaySlot: false,
      slotLabelInterval: 15,
      aspectRatio: 5,
      editable: true,
      resourceOrder: 'sortOrder',   
      stickyFooterScrollbar : true,
      // height: 1000, 
      contentHeight: 'auto',
      expandRows: true,
      dateClick: this.handleDateClick.bind(this),
      eventClick: this.eventClicked.bind(this),
      eventDrop: this.dropItem.bind(this),
      eventDidMount: (info) => {
        let id = info.event.id;
        let gid = info.event.groupId;
        let date = info.event.start;
        info.el.addEventListener("contextmenu", (jsEvent)=>{
            jsEvent.preventDefault();
            const dialogRef = this.dialog.open(TimeGridDialogComponent, {
              width: '500px',
              data: {id: id, group_id: gid, date: date }
            });
            dialogRef.afterClosed().subscribe(result => {
              if(result.success){        
                this.therapist = result.data;
                const now = moment(new Date()).format("YYYY-MM-DD");
                this.getAvailableTherapistBookingsSchedules(now);
              }
            }); 
        }),
        tippy(info.el, {
          duration: 0,
          arrow: true, 
          theme: 'tomato',
          content: info.event.extendedProps['description'] || 'N/A',
          placement: 'top',  
          animation: 'scale-extreme',
          allowHTML: true,
          maxWidth: 350,
         })      
      },
      resources: [],
      events: [],
    }

    calendarRoomOption: CalendarOptions  = {
      headerToolbar: {
        end: 'today'
      },
      timeZone: 'local',
      initialView: 'resourceTimeGridDay',
      schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
      plugins: [ interactionPlugin, resourceTimelinePlugin  ],    
      slotMinTime: '10:00:00',
      slotMaxTime: '26:00:00',
      allDaySlot: false,
      slotDuration: '00:15:00',
      slotLabelInterval: 15,
      aspectRatio: 5,
      editable: false,
      resources: [],
      events: [],
      resourceOrder: 'sortOrder',
      height: 555,
    }
    
    calendarApi?: Calendar;
    
    arrayEvents: any = [];
    selectedIndex: any;
    dayNow: any = moment().format("dddd");
    today: any = moment(new Date()).format("MM-DD-YYYY");
    books: any = [];
    searchGuestName: any;
    
    dateSelected: any = [];

    currentPriv: any;
    currentBranch: any;

    privs: any  =[];
    privsArray: any  =[];
    members: any = [];
    
    displayedColumns: string[] = [
      'booked_date',
      'time_start',
      'book_guest_name',
      'book_guest_number',
      'book_pax',
      'service_name',
      'service_dur',
      'status',
      'action'
    ];  
    historyDisplayedColumns: string[] = [
      'cus_name',
      'cus_no',
      'cus_note',
      'cus_cat',
      'action'
    ]; 
    
    dataSource = new MatTableDataSource([]);
    historyDataSource = new MatTableDataSource([]);
    customers: any =[];
    pageSizeOptions: number[] = [10, 15, 20];
    pageSize: any = 0;
    pageLength: any;
    pageIndex: any = 0;
    currentIndex: any = 0;
    searchData: any = '';

    therapistBookings: any = [];
    extraTime: any = [];

    myControl = new FormControl();
    filteredOptions?: Observable<any[]>;
    therapist: any;
    resourcesData: any = [];
    rooms: any = [];
    constructor(
      private dialog: MatDialog,
      private book: BookingsService,
      private main: MainService,
      private mem: MemberService,
      private acc: AccountService,
      private cus: CustomerService,
      private http: HttpClient,
    ) { }

    @ViewChild(MatPaginator) paginator!: MatPaginator; 

    ngOnInit(): void {    
      this.main.getNavsWithPrivs({data: this.main.getCurrentUserAccId()}).subscribe((res: any) =>{
        if(res.success){
          this.privs = res.response || [];
          this.privs.forEach((e: any) => {
              if(e.nav_name === 'bookings'){
                  this.privsArray = e;
              }
          });               
        }
      })
      this.currentPriv = this.main.getCurrentUserPrivileges();
      this.currentBranch = this.main.getCurrentUserBranch();
      this.getMembers(this.currentBranch);
      this.getExtraTime(this.currentBranch);
      this.bookingListDisplay('', 0);   
      
      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        map(value => (typeof value === 'string' ? value : value.mem_name)),
        map(mem_name => (mem_name ? this._filter(mem_name) : this.members.slice())),
      );                
    }

    ngAfterViewChecked() {
      this.calendarApi = this.calendarComponent.getApi();
    }

    checkMemberAvailabilityYesterday(){
      // this.mem.checkMemberAvailabilityYesterday({data: this.currentBranch}).subscribe((res: any) =>{
      //   console.log(res);
        
      // })
    }

    getCurrentClient(data: any){
      this.book.getClientsBooking({data: data.id, date: data.date }).subscribe((res: any) =>{
        if(res.success){
          let arr = res.response.length ? res.response : [];
          this.addBooking({action: 'arrival-single', sub: data.date, data: arr[0]});
        }
      })      
    }

    tabClick(event: any){
      if(event.index === 0){
        this.initiateTimeGridCalendar();
        this.search();
      } else if(event.index === 1){
        this.initiateRoomCalendar();
        this.getAllRooms();  
        this.getAvailableTherapistBookingsSchedules(this.initiateDate);
      }
    }

    initiateTimeGridCalendar() {
      this.calendarOptions  = {
        headerToolbar: {
          end: 'today'
        },
        timeZone: 'local',
        initialDate: this.initiateDate,
        initialView: 'resourceTimeGridDay',
        schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
        plugins: [ interactionPlugin, resourceTimelinePlugin  ],    
        slotMinTime: '10:00:00',
        slotMaxTime: '24:00:00',
        allDaySlot: false,
        slotDuration: '00:15:00',
        slotLabelInterval: 15,
        aspectRatio: 5,
        editable: true,
        resourceOrder: 'sortOrder',   
        height: 1000, 
        
        // height: 1000, 
        dateClick: this.handleDateClick.bind(this),
        eventClick: this.eventClicked.bind(this),
        eventDrop: this.dropItem.bind(this),
        eventDidMount: (info) => {
          let id = info.event.id;
          let gid = info.event.groupId;
          info.el.addEventListener("contextmenu", (jsEvent)=>{
              jsEvent.preventDefault();
              const dialogRef = this.dialog.open(TimeGridDialogComponent, {
                width: '500px',
                data: {id: id, group_id: gid }
              });
              dialogRef.afterClosed().subscribe(result => {
                if(result.success){        
                  this.therapist = result.data;
                  const now = moment(new Date()).format("YYYY-MM-DD");
                  this.search();
                  this.getAvailableTherapistBookingsSchedules(now);
                }
              }); 
          }),
          tippy(info.el, {
            arrow: true, 
            theme: 'tomato',
            content: info.event.extendedProps['description'].length ? info.event.extendedProps['description'] : 'N/A',
            placement: 'top',  
            animation: 'scale-extreme',
            allowHTML: true,
            maxWidth: 350,
           })     
         },
        resources: [],
        events: [],
       }
     }

     handleDateClick(data: any){
      let array = {action: 'add', sub: 'timegrid', date: data.date, mem_id: data.resource.id};
        const dialogRef = this.dialog.open(AddBookingDialogComponent, {
          width: 'auto',
          data: array
        });  
        dialogRef.afterClosed().subscribe(result => {
          this.bookingListDisplay('', 0);  
          this.search();
          this.initiateTimeGridCalendar();   
        }); 
     }

    initiateRoomCalendar() {
     this.calendarRoomOption  = {
        headerToolbar: {
          end: 'today'
        },
        timeZone: 'local',
        initialView: 'resourceTimeGridDay',
        schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
        plugins: [ interactionPlugin, resourceTimelinePlugin  ],    
        slotMinTime: '10:00:00',
        slotMaxTime: '24:00:00',
        allDaySlot: false,
        aspectRatio: 2,
        editable: false,
        resources: [],
        events: [],
        resourceOrder: 'sortOrder',
        height: 555
      }
    }

    getAllRooms(){
      this.main.getAllRooms().subscribe((res: any) =>{
        this.rooms = res.success ? res.response : [];
        let resoureData: any = [];        
        this.rooms.forEach((el: any) => {   
            resoureData.push({id: el.room_id, title: el.room_name});
        });               
        this.calendarRoomOption.resources = resoureData;
      });
    }

    getExtraTime(b: any){
      this.main.getExtraTime({data: b}).subscribe((res: any) =>{      
          this.extraTime = res.success ? res.response[0].et_time : [];
      })
    }

    getAvailableTherapistOnTheDate(){
      let xdate = this.dateSelected.length === undefined ? new Date(this.dateSelected) : new Date();
      let date = this.dateSelected ? moment(xdate).format("YYYY-MM-DD") : null;  
      this.calendarApi?.gotoDate(date);  
      this.mem.getAvailableTherapistOnTheDate({data: date}).subscribe((res: any) =>{
          if(res.success){
              this.resourcesData = [];
              res.response.forEach((el: any) =>{
                  this.resourcesData.push({id: el.mem_id, title: el.mem_name}); 
              });
              this.calendarOptions.resources = this.resourcesData;
              this.getAvailableTherapistBookingsSchedules(date);  
          }     
      })      
    }

    search(){
      let date: any;
      let now = moment(new Date()).format("YYYY-MM-DD");
      if(this.dateSelected.length === undefined){
          if(this.dateSelected){
              date = moment(this.dateSelected).format("YYYY-MM-DD");            
            } else {  
              date = moment(new Date()).format("YYYY-MM-DD");
              if(date){                     
                let table = date === now ? 'tbl_avail_member' : 'tbl_avail_member_log';
                    this.mem.getAvailabilityByBranchAndDate({data: this.currentBranch, date: date, table: table}).subscribe((res: any ) => {
                      this.members = res.success ? res.response : [];  
                      this.calendarApi?.gotoDate(date);
                      if(this.members.length > 0){
                        this.resourcesData = [];
                        this.members.forEach((el: any) =>{          
                          this.resourcesData.push({id: el.mem_id, title: el.mem_name, sortOrder: el.avail_mem_order});
                        });             
                        this.calendarOptions.resources = this.resourcesData;                        
                        this.getAvailableTherapistBookingsSchedules(date);          
                      } else {     
                        this.main.snackbar('No reservation for that day.', 'X', 2500, 'warn-panel');
                        this.dateSelected = [];
                        this.getAvailableTherapistOnTheDate();
                      }
                 })
              } else {
                this.main.snackbar('Invalid date format.', 'X', 2000, 'warn-panel');
              }   
          }
        } else {
          date = moment(new Date()).format("YYYY-MM-DD");
      }
      
      if(date){      
        let table = date === now ? 'tbl_avail_member' : 'tbl_avail_member_log';
            this.mem.getAvailabilityByBranchAndDate({data: this.currentBranch, date: date, table: table}).subscribe((res: any ) => {
              this.members = res.success ? res.response : [];  
              this.calendarApi?.gotoDate(date);
              if(this.members.length > 0){
                this.resourcesData = [];
                this.members.forEach((el: any) =>{          
                  this.resourcesData.push({id: el.mem_id, title: el.mem_name, sortOrder: el.avail_mem_order});
                });             
                this.calendarOptions.resources = this.resourcesData;
                this.getAvailableTherapistBookingsSchedules(date);          
              } else {   
                this.book.checkBookingByDateSelect({date: date, id: this.currentBranch}).subscribe((result: any) =>{
                  if(result.success){
                    if(result.response.length === 0){
                      this.dateSelected = [];
                      this.main.snackbar('No reservation for that day.', 'X', 2500, 'warn-panel');
                    }
                  }
                });
                 this.getAvailableTherapistOnTheDate();
              }
         })
      } else {
        this.main.snackbar('Invalid date format.', 'X', 2000, 'warn-panel');
      }      
    }

    displayFn(item: any): string {    
      return item && item ? item.mem_name : '';
    }

    private _filter(value: string): string[] {
      const filterValue = value.toLowerCase();
      return this.members.filter((member: any) => member.mem_name.toLowerCase().includes(filterValue));
    }

    getMemberById(id: any){
      this.mem.getMemberById({data: id}).subscribe((res: any) =>{
          this.therapist = res.success ? res.response[0] : [];        
      })
    }

    getTherapistBookings(memberId: any){
      this.book.getTherapistBookings({data: memberId}).subscribe((result: any) =>{ 
        this.therapistBookings = result.success ? result.response : [];
        let arr: any = [];
        if(this.therapistBookings.length > 0){
            this.therapistBookings.forEach((element: any) =>{  
              const now = moment(new Date()).format("YYYY-MM-DD");
              const date = moment(new Date(element.booked_date)).format("YYYY-MM-DD");
              let YY = moment(new Date(element.booked_date)).format("YYYY");
              let MM = moment(new Date(element.booked_date)).format("MM");
              let DD = moment(new Date(element.booked_date)).format("DD");
              let HH = moment(element.time_start, 'HH:mm:ss').format('HH');
              let MMM = moment(element.time_start, 'HH:mm:ss').format('mm');

              let start = moment(element.time_start, 'HH:mm:ss').format('HH:mm');
              let timeAndDate = moment(date + ' ' + start);
              let timedate_parsed = moment(timeAndDate).format();

              const total_duration = element.total_dur.toString().split('.');
              let hour = total_duration[0] ? parseInt(total_duration[0]) : '';
              let minutes = total_duration[1] ? total_duration[1] : null;
              let end;
              let end_;
              let addTime;
              if(minutes){
                let m = '.' + minutes;
                let mm = (parseFloat(m) * 60) + this.extraTime;     
                addTime = hour.toString() + ':' + mm.toString();     
                end_ = moment(new Date(parseInt(YY),parseInt(MM)-1,parseInt(DD), parseInt(HH), parseInt(MMM), 0)).add( moment.duration(addTime));
                end =  moment(end_).format();
              } else {
                addTime = hour.toString() + `:${this.extraTime}`;
                end_ = moment(new Date(parseInt(YY),parseInt(MM)-1,parseInt(DD), parseInt(HH), parseInt(MMM), 0)).add( moment.duration(addTime));
                end =  moment(end_).format();              
              };              
              arr.push({
                  resourceId: element.mem_id,
                  date: date,
                  title: element.service_name,
                  start: new Date(timedate_parsed).getTime(),
                  end: new Date(end).getTime(),
                  id: element.book_guest_id,
                  classNames: 'time-grid',
                  backgroundColor: '#082827',
                  borderColor: '#082827',
                  groupId: element.book_id,
              })
            });         
            this.calendarOptions.events = arr;
        } else {
          this.calendarOptions.events = [];
        }
      })
    }

    
    handlePageEvent(event: PageEvent) {
      this.pageSize = event.pageSize;
      this.pageIndex = event.pageIndex;
      this.currentIndex = this.pageSize * this.pageIndex;
      this.bookingListDisplay('', this.currentIndex);     
    }
    
    getMembers(x: any){
      let date;      
      const now = moment(new Date()).format("YYYY-MM-DD");
      if(this.dateSelected.length === undefined){
        if(this.dateSelected){
          date = moment(this.dateSelected).format("YYYY-MM-DD");
        } else {
          date = moment(new Date()).format("YYYY-MM-DD");
        }
      } else {
        date = moment(new Date()).format("YYYY-MM-DD");
      }
      let table = date === now ? 'tbl_avail_member' : 'tbl_avail_member_log';
      this.mem.getAvailabilityByBranchAndDate({data: x, date: date, table: table}).subscribe((res: any ) => {
          this.members = res.success ? res.response : [];
          this.calendarOptions.resources = res.success = [];
          this.members.forEach((el: any) =>{          
            this.resourcesData.push({id: el.mem_id, title: el.mem_name, sortOrder: el.avail_mem_order});
          });             
          this.calendarOptions.resources = this.resourcesData;
          this.getAvailableTherapistBookingsSchedules(null);
      })
    }

    moveTolastPosition(el: any){
      const a = {
          mem_id: el.mem_id,
          branch_id: el.branch_id
      }
      this.members.splice(this.members.length + 1, 0, a);
      this.reorderAvailMembers(this.members);
    }

    reorderAvailMembers(x: any){
      this.mem.reorderAvailMembers({data: x}).subscribe((res: any ) =>{
        if(res.success){
          this.getMembers(this.currentBranch);
          this.main.snackbar(res.response, 'X', 2000, 'primary-panel');
        } else {
          this.main.snackbar(res.response, 'X', 2000, 'warn-panel');
        }
      })
    }



    bookingListDisplay(x: any, index: any){
      if(this.currentPriv === 'super-admin') {
        this.getBookings('', x, index !== 0 ? index : this.pageIndex, this.pageSize);
      } else {
        this.getBookings(this.currentBranch, x,  index !== 0 ? index : this.pageIndex, this.pageSize);
      }
    }

    searching(){
      this.bookingListDisplay(this.searchGuestName, 0);
    }
    
    addBooking(data: any){
      if(data.action === 'update'){
        const dialogRef = this.dialog.open(AddBookingDialogComponent, {
          width: 'auto',
          data: data
        });  
        dialogRef.afterClosed().subscribe(result => {
          this.bookingListDisplay('', 0);     
        });
      } else if(data.action === 'add') {
        const dialogRef = this.dialog.open(AddBookingDialogComponent, {
          width: '750px',
          data: data
        });  
        dialogRef.afterClosed().subscribe(result => {
          this.bookingListDisplay('', 0);      
        });
      } else if(data.action === 'additional') {      
        const dialogRef = this.dialog.open(AddAdditionalGuestComponent, {
          width: '750px',
        });  
        dialogRef.afterClosed().subscribe(result => {
          this.bookingListDisplay('', 0);      
        });
      } else {        
        const dialogRef = this.dialog.open(AddBookingDialogComponent, {
          width: data.book_pax > 1 ? '1000px': '980px',
          data: data
        });  
        dialogRef.afterClosed().subscribe(result => {
          this.bookingListDisplay('', 0);    
          if(result){  
            if(result.success === true){
              this.selectedIndex = 0;     
              const now = moment(new Date()).format("YYYY-MM-DD");
              this.updateBookingStatus(result.array[0], result.array[0].booked_status)
              this.getAvailableTherapistBookingsSchedules(now);
            }     
          }     
        });
      }
      this.searchGuestName = "";
    }

    getBookings(branch: any, search: any, index: any, size: any){
      this.book.getBookings({data: branch, search: search, index: index, size: size}).subscribe((res: any)=>{
        this.books = res.success ?  res.response : [];
        this.pageLength = res.success ? res.total : 0;        
        this.books.forEach((el: any) =>{
            el.date_formated = moment(el.booked_date).format("MM-DD-YYYY");
            el.time_start = this.main.convertTime24to12(el.time_start);
            this.breakdownDateAndTime(el);
        });       
        this.dataSource = this.books;
      });
    }

    breakdownDateAndTime(item: any){
      const date = item.booked_date;
      const start = item.time_start;
      const end = item.time_end;
    }

    alertMessage(x:any){
      const dialogRef = this.dialog.open(AlertDialogComponent, {
        width: '250px',
        data: {
          message: 'Are you sure you want to remove this booking?',
          component: 'booking',
          data: x.book_id
        },
      });

      dialogRef.afterClosed().subscribe(result => {
        this.bookingListDisplay('', 0);   
      });
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

    updateBookingStatus(el: any, stats: any){  
      const now = moment(new Date()).format("YYYY-MM-DD");  
      if(stats === 3 && el.room_id === 0){
        this.main.snackbar('Please update room first before marking it arrived', 'X', 2500, 'warn-panel');
      } else {
        this.book.updateBookingByGuestId({data: {booked_status: stats}, id: el.book_guest_id}).subscribe((res: any) =>{
          if(res.success){          
              let room;  
              if(el.room_id > 0 && stats === 3){
                let rps_format;

                if(el.room_pax_status){
                  const rps = el.room_pax_status.split(',');
                  rps_format = this.loopData(rps, '0');
                } else {
                  rps_format = null;
                }
                room = {
                  room_status: 0,
                  room_pax_status: rps_format,
                  room_id: el.room_id
                }
                this.main.updateRoom({data: room}).subscribe((resu: any) =>{
                  this.bookingListDisplay('', this.currentIndex);   
                  this.main.snackbar(resu.response, 'X', 2000, 'primary-panel');
                })
              } else {
                let rps_format;
                if(el.room_pax_status){
                  const rps = el.room_pax_status.split(',');
                  rps_format = this.loopData(rps, '1');
                } else {
                  rps_format = null;
                }
                room = {
                  room_status: 1,
                  room_pax_status: rps_format,
                  room_id: el.room_id
                }
                this.main.updateRoom({data: room}).subscribe((resu: any) =>{
                  this.bookingListDisplay('', this.currentIndex);   
                  this.main.snackbar(resu.response, 'X', 2000, 'primary-panel');
                })
              }  
              if(stats === 3){
                // this.moveTolastPosition(el);
              } 
              this.getAvailableTherapistBookingsSchedules(now);

              if(stats === 4 || stats === 5){

              }
          } else {        
              this.main.snackbar('Update booking status failed!', 'X', 2000, 'red-panel');
          }
        })

        let total = el.total_services ? el.total_services : 0;
        let id = el.mem_id ? el.mem_id : 0;  
        let op = stats === 1 ? '+' : '-';
        this.mem.updateTotalMemberServices({data: total, id: id, operator: op}).subscribe((opResult: any) =>{
          if(opResult.success){
            this.main.snackbar('Service calculated', 'X', 2000, 'primary-panel');
          }
        })
      }
    }

    eventClicked(event: any){  
      let id = event.event.id; // book guest id
      let gid = event.event.groupId; // booking id
      let date = event.event.start; // date
      let data = {
        id: id,
        date: date
      }
      this.getCurrentClient(data);
       
      // this.addBooking({action: 'arrival-single', data: event});
      // const dialogRef = this.dialog.open(TimeGridDialogComponent, {
      //   width: '500px',
      //   data: {id: id, group_id: gid }
      // });
      // dialogRef.afterClosed().subscribe(result => {
      //   if(result.success){        
      //     this.therapist = result.data;
      //     const now = moment(new Date()).format("YYYY-MM-DD");
      //     this.getAvailableTherapistBookingsSchedules(now);
      //   }
      // });    
    }

    dropItem(event: any) {    
      const date = moment(new Date(event.event.start)).format("YYYY-MM-DD");
      const start = moment(new Date(event.event.start)).format('HH:mm:ss');
      const end = moment(new Date(event.event.end)).format('HH:mm:ss');
      let id = event.event.groupId;
      let data = {
          time_start: start,
          time_end: end,
          booked_date: date
      } 
      this.book.updateBooking({data: data, id: id}).subscribe((res: any) =>{
        if(res.success){
            this.main.snackbar(res.response, 'X', 2000, 'primary-panel');
        } else {          
            this.main.snackbar('Updating Booking Failed', 'X', 2000, 'warn-panel');
        }
      }) 
    }

    // ======================================================================== //
    //                    Display Calendar Events            
    // ======================================================================== //

    getAvailableTherapistBookingsSchedules(date: any){
        this.book.getAvailableTherapistBookingsSchedules({data: date}).subscribe((result: any) =>{
        this.therapistBookings = result.success ? result.response : [];
        let arr: any = [];        
        let arrRoom: any = [];  
        if(this.therapistBookings.length > 0){
          this.calendarOptions.events = [];
          this.calendarRoomOption.events = [];
            this.therapistBookings.forEach((element: any) =>{  
              const date = moment(new Date(element.booked_date)).format("YYYY-MM-DD");
              let YY = moment(new Date(element.booked_date)).format("YYYY");
              let MM = moment(new Date(element.booked_date)).format("MM");
              let DD = moment(new Date(element.booked_date)).format("DD");
              let HH = moment(element.time_start, 'HH:mm:ss').format('HH');
              let MMM = moment(element.time_start, 'HH:mm:ss').format('mm');

              let start = moment(element.time_start, 'HH:mm:ss').format('HH:mm');
              let time_end = moment(element.time_end, 'HH:mm:ss').format('HH:mm');
              let timeStartDate = moment(date + ' ' + start);
              let timeEndDate = moment(date + ' ' + time_end);
              let start_time_parsed = moment(timeStartDate).format("yyyy-MM-DDTHH:mm:ss");
              let end_time_parsed = moment(timeEndDate).format("yyyy-MM-DDTHH:mm:ss");
              
              const ser = element.service_name ? element.service_name : '';
              
              arr.push({
                  resourceId: element.mem_id,
                  date: date,
                  title: element.book_guest_name + ' - ' + ser + ' - ' +  '₱ '+element.total_price,
                  start: start_time_parsed,
                  end: end_time_parsed,
                  id: element.book_guest_id,
                  classNames: 'time-grid',
                  backgroundColor: 
                  element.booked_status === 0 ? '#87a2c7' 
                  : element.booked_status === 1 ?  '#63a338' 
                  : element.booked_status === 2 ? '#ce4f4b' 
                  : element.booked_status === 3 ? '#f1bc64'
                  : element.booked_status === 4 ? '#998af7a0' 
                  : element.booked_status === 5 ? '#596362' : '#998af7a0',
                  borderColor: element.booked_status === 0 ? '#87a2c7' : element.booked_status === 1 ?  '#63a338' : element.booked_status === 2 ? '#ce4f4b' : element.booked_status === 3
                  ? '#f1bc64' : element.booked_status === 4
                  ? '#998af7a0' 
                  : element.booked_status === 5 ? '#596362' : '#998af7a0',
                  textColor:  element.booked_status === 1 ? 'black' : 'white',
                  groupId: element.book_id,
                  extendedProps: { department: 'BioChemistry' },
                  description: element.notes,
                  resourceEditable: false,
                  editable: element.mem_restricted === 0 ? 1 : 0,
              });
                arrRoom.push({
                  resourceId: element.room_id,
                  date: date,
                  title: element.book_guest_name + ' - ' + ser + ' - ' +  '₱ '+element.total_price,
                  start: start_time_parsed,
                  end: end_time_parsed,
                  id: element.book_guest_id,
                  classNames: 'time-grid',
                  backgroundColor: 
                  element.booked_status === 0 ? '#87a2c7' 
                  : element.booked_status === 1 ?  '#63a338' 
                  : element.booked_status === 2 ? '#ce4f4b' 
                  : element.booked_status === 3 ? '#f1bc64'
                  : element.booked_status === 4 ? '#998af7a0' 
                  : element.booked_status === 5 ? '#596362' : '#998af7a0',
                  borderColor: element.booked_status === 0 ? '#87a2c7' : element.booked_status === 1 ?  '#63a338' : element.booked_status === 2 ? '#ce4f4b' : element.booked_status === 3
                  ? '#f1bc64' : element.booked_status === 4
                  ? '#998af7a0' 
                  : element.booked_status === 5 ? '#596362' : '#998af7a0',
                  textColor:  element.booked_status === 1 ? 'black' : 'white',
                  groupId: element.book_id,
                  resourceEditable: false,
              });
            });          
            this.calendarOptions.events = arr;
            this.calendarRoomOption.events = arrRoom;
            
        } else {
          this.calendarOptions.events = [];
          this.calendarRoomOption.events = [];
        }
      })
    }


  }
