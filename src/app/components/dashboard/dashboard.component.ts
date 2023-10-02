import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { BookingsService } from 'src/app/core/services/bookings.service';
import { MainService } from 'src/app/core/services/main.service';
import { MemberService } from 'src/app/core/services/member.service';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  dateNow: any = moment().format("dddd, MMMM DD, YYYY");
  timeNow: any = moment().format("hh:mm A");

  logged_in_branch: any = '';
  
  allBookings: any = 0;
  allServices: any = 0;
  allTherapist: any = 0;
  totalBookings: any = 0;
  totalTherapist: any = 0;
  totalRoom: any = 0;
  avail: any  = [];
  totals: any  = [];
  constructor(
    private main: MainService,
    private book: BookingsService,
    private mem: MemberService
  ) { }

  ngOnInit(): void {
    this.logged_in_branch = this.main.getCurrentUserBranch();
    this.getTotalBookingsAsOfToday();
    this.getAvailabilityByBranch();
    this.getAllCounts();
  }

  getTotalBookingsAsOfToday(){
      this.book.getTotalBookingsAsOfToday().subscribe((res: any) =>{        
          this.totalBookings = res.success ? res.response[0][0].total : 0;
          this.totalTherapist = res.success ? res.response[1][0].total : 0;
          this.totalRoom = res.success ? res.response[2][0].total : 0;
      })
  } 

  getAvailabilityByBranch(){
      this.mem.getAvailabilityByBranchForDashboard({data: this.logged_in_branch}).subscribe((res: any) =>{
          this.avail = res.success ? res.response : [];
      })
  }  

  getAllCounts(){
    this.book.getAllCounts().subscribe((res: any) =>{
        this.totals = res.success ? res.response : [];          
        this.allTherapist = res.success ? res.response[0][0].total : 0;
        this.allBookings = res.success ? res.response[1][0].total : 0;
        this.allServices = res.success ? res.response[2][0].total : 0;
    })
}

}
