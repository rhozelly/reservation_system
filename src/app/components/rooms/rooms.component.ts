import {Component, OnInit, ViewChild} from '@angular/core';
import {MainService} from "../../core/services/main.service";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {AlertDialogComponent} from "../../dialogs/alert-dialog/alert-dialog.component";
import {faBed} from '@fortawesome/free-solid-svg-icons';
import { Calendar, CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
import interactionPlugin from '@fullcalendar/interaction';
import resourceTimelinePlugin from '@fullcalendar/resource-timegrid';
import { BookingsService } from 'src/app/core/services/bookings.service';
import * as moment from 'moment';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;  
  calendarOptions: CalendarOptions  = {
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
  calendarApi?: Calendar;
  
  rooms: any = [];
  rooms_grid: any = [];
  room_pax: any = [];
  grid: boolean = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = [
    'room_name',
    'room_cat',
    'room_pax',
    'room_status',
    'action'
  ];
  dataSource = new MatTableDataSource([]);
  pageSizeOptions: number[] = [6, 12];
  pageSize: any = 12;
  pageLength: any;
  pageIndex: any = 0;
  searchData: any = '';

  faBedEmpty: any = faBed;

  bookId: any;
  privs: any = [];
  privsArray: any = [];

  roomBooking: any = [];

  constructor(
    private main: MainService,
    private router: Router,
    private dialog: MatDialog,    
    private route: ActivatedRoute,
    private book: BookingsService
  ) { }

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
    if(this.route.snapshot.params){
      this.bookId = this.route.snapshot.params;      
    }
    // this.getAvailableTherapistBookingsSchedules();
    this.getRooms( this.pageSize, this.pageIndex, this.searchData );
  }

  
  ngAfterViewChecked() {
    // this.calendarApi = this.calendarComponent.getApi();
  }

  getRooms(size: any, i: any, s: any){
    this.main.getRooms({size:size, index: i, search: s}).subscribe((res: any) =>{
      this.rooms = res.success ? res.response : [];
      this.rooms_grid = res.success ? res.response : [];
      this.pageLength = res.success ? res.length : [];
      this.dataSource = this.rooms;
    });
  }

  loopData(x: any, y: any){
    let beds: any = [];
    for(let i = 1; i <= x; i++) {
      beds.push({
        bed: i,
        bed_status: y.split(",")  
      });
    }
    return beds;
  }

  searchbar() {
    this.getRooms( this.pageSize, this.pageIndex, this.searchData );
  }

  alertMessage(x: any){
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      width: '250px',
      data: {
        message: 'Are you sure you want to remove this room?',
        component: 'rooms',
        data: x.room_id
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.getRooms( this.pageSize, this.pageIndex, this.searchData );
      }
    });
  }

  addRoom(){
    this.router.navigate([`${this.main.getCurrentUserPrivileges()}/add-room`]);
  }

  editRoom(id: any){
    this.router.navigate([`${this.main.getCurrentUserPrivileges()}/update-room`,{data: id}]);
  }


  handlePageEvent(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    let currentIndex = this.pageSize * this.pageIndex;
    this.getRooms( this.pageSize, currentIndex, this.searchData );
  }

}
