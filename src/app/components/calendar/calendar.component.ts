import { AfterViewInit, Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CalendarOptions, EventApi, FullCalendarComponent } from '@fullcalendar/angular'; 
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { BookingsService } from 'src/app/core/services/bookings.service';
import { AddBookingDialogComponent } from 'src/app/dialogs/add-booking-dialog/add-booking-dialog.component';
import * as moment from 'moment';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements AfterViewInit, OnInit {
  spinner: boolean = false;
  currentDisplay: any;
  todaysDate = new Date();

  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  calendarOptions: CalendarOptions  = {
    plugins: [ interactionPlugin, dayGridPlugin ],
    initialView: 'dayGridMonth',
    weekends: true,
    dateClick: this.handleDateClick.bind(this),
    eventClick: this.currentCalendarDisplay.bind(this),
    eventsSet: this.eventClicked.bind(this),
    events: [],
    aspectRatio: 2
  }
  events: any = [];
  arrayEvents: any = [];

  constructor(
      private dialog: MatDialog,
      private book: BookingsService,
      private render: Renderer2
  ) { }

  ngOnInit(): void { 
    this.calendarEventDisplay(); 
  }

  ngAfterViewInit(){    

  }

  getDaysInMonth(firstInitiate: any) {
    // const d = splice(start_index, number_of_elements_to_remove, 2);
    // let y = firstInitiate ? new Date().getFullYear() : new Date(this.currentDisplay).getFullYear();
    // let m = firstInitiate ? new Date().getMonth() : new Date(this.currentDisplay).getMonth();
    let y = firstInitiate ? new Date().getFullYear() : new Date(this.currentDisplay).getFullYear();
    let m = firstInitiate ? new Date().getMonth() : new Date(this.currentDisplay).getMonth();
    // let date = new Date(y, m, 1);
    let date = new Date(y, 1, 1);
    let days = [];
    for (let i = 0; i < 12; ++i) {
      while (date.getMonth() === i) {
          days.push(moment(new Date(date)).format(`YYYY-MM-DD`));
          date.setDate(date.getDate() + 1);
      }
    } 
    return days;
  }

  eventClicked(ev: any){
  }

  calendarEventDisplay(){  
    this.spinner = true;
    const currentDates = this.getDaysInMonth(true);
    this.book.calendarEventDisplay({data: currentDates}).subscribe((res: any) =>{
      this.events = res.success ? res.response : [];
      this.arrayEvents = [];
        this.events.forEach((el: any) =>{
          this.arrayEvents.push({          
            title: el.booked_status === 0 ? 'Pending Bookings'+ '('+el.total+')' :  el.booked_status === 1 ? 'Completed'+ '('+el.total+')' :  el.booked_status === 2 ? 'Cancelled'+ '('+el.total+')' :  el.booked_status === 3 ? 'Arrived'+ '('+el.total+')' : '',
            date: moment(new Date(el.booked_date)).format("YYYY-MM-DD"), 
            display: 'list-item',
            color: el.booked_status === 0 ? '#267F98'+ '('+el.total+')' :  el.booked_status === 1 ? '#D2AD66'+ '('+el.total+')' :  el.booked_status === 2 ? '#2EBC30'+ '('+el.total+')' :  el.booked_status === 3 ? '#AC4136': '#267F98'
          });
      });   
      setTimeout((r: any) =>{
        this.calendarOptions.events = this.arrayEvents;        
        this.spinner = false;
      }, 400);   
    })
  }

  currentCalendarDisplay(event: any){     
    // console.log('load events here ========='); 
    // console.log(event);
    
    // if(event.length > 0) {        
    //   this.currentDisplay = event[0]._context.getCurrentData().currentDate;
    //   let evMonth = new Date(this.currentDisplay).getMonth() + 1;
    //   let curMonth = this.todaysDate.getMonth() + 1;
    //   let evYear = new Date(this.currentDisplay).getFullYear();
    //   let curYear = this.todaysDate.getFullYear();
      
    //   if(evMonth !== curMonth){
    //     const currentDates = this.getDaysInMonth(false);
    //     this.spinner = true;
    //     this.book.calendarEventDisplay({data: currentDates}).subscribe((res: any) =>{
    //       this.events = [];
    //       this.calendarOptions.events = [];
    //       this.events = res.success ? res.response : [];
    //       this.arrayEvents = [];
    //       this.events.forEach((el: any) =>{            
    //           this.arrayEvents.push({
    //               title: el.booked_status === 0 ? 'Booked'+ '('+el.total+')' :  el.booked_status === 1 ? 'Arrived'+ '('+el.total+')' :  el.booked_status === 2 ? 'Completed'+ '('+el.total+')' :  el.booked_status === 3 ? 'Cancelled'+ '('+el.total+')' : '',
    //               date: moment(new Date(el.booked_date)).format("YYYY-MM-DD"), 
    //               display: 'list-item',
    //               color: el.booked_status === 0 ? '#267F98'+ '('+el.total+')' :  el.booked_status === 1 ? '#D2AD66'+ '('+el.total+')' :  el.booked_status === 2 ? '#2EBC30'+ '('+el.total+')' :  el.booked_status === 3 ? '#AC4136': '#267F98'
    //           });
    //       });   
    //       setTimeout((r: any) =>{
    //         this.calendarOptions.events = this.arrayEvents;        
    //         this.spinner = false;
    //       }, 400);   
    //     })    
    //   }
    // } else {
    //     this.calendarEventDisplay();
    // }
  }

  handleDateClick(arg: any) {
    const dialogRef = this.dialog.open(AddBookingDialogComponent, {
        width: '750px',
        data: {data: arg, action: 'add', calendar: true}
    });  
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        //  this.calendarEventDisplay(); 
      }
    });
  }

}
