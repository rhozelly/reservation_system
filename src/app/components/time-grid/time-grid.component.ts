import { Component, OnInit, ViewChild } from '@angular/core';
import { CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import resourceTimelinePlugin from '@fullcalendar/resource-timegrid';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-time-grid',
  templateUrl: './time-grid.component.html',
  styleUrls: ['./time-grid.component.css']
})
export class TimeGridComponent implements OnInit {

  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
  date = new Date(2022, 5, 16, 13, 30, 0); 
  calendarOptions: CalendarOptions  = {    
    timeZone: 'UTC',
    initialView: 'resourceTimeGridDay',
    schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
    plugins: [ interactionPlugin, resourceTimelinePlugin  ],
    resources: [
      { id: 'a', title: 'Room A' },
      { id: 'b', title: 'Room B'},
      { id: 'c', title: 'Room C' },
      { id: 'd', title: 'Room D' }
    ],
    slotMinTime: '10:00:00',
    slotMaxTime: '24:00:00',
    allDaySlot: false,
    // // plugins: [ interactionPlugin, resourceTimeGridPlugin ],
    // plugins: [ interactionPlugin, timeGridPlugin  ],
    // initialView: 'resourceTimeGridDay',
    // resources: [
    //   { id: 'a', title: 'Room A' },
    //   { id: 'b', title: 'Room B'},
    //   { id: 'c', title: 'Room C' },
    //   { id: 'd', title: 'Room D' }
    // ],     
    // duration: { days: 1 },
    // weekends: true,
    // dayHeaders: false,
    // // dateClick: this.handleDateClick.bind(this),
    // // eventClick: this.currentCalendarDisplay.bind(this),
    // // eventsSet: this.eventClicked.bind(this),
    events: [ {
      resourceId: 'a',
      id: 'a',
      date: "2022-05-31",
      start: "2022-05-31T09:00:00",
      // start: "1654141036",
      end: "2022-05-31T11:00:00",
      title: `Sample`,
      content: 'asd <br /> assad',
      color: 'red',
      textColor: 'black',
      classNames: ['hackdog']
    }],
    aspectRatio: 2
  }
  constructor() { }

  ngOnInit(): void { 
  }

}
