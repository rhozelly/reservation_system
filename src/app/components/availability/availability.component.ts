import { Component, OnInit } from '@angular/core';
import { MainService } from 'src/app/core/services/main.service';
import { MemberService } from 'src/app/core/services/member.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { faBed } from '@fortawesome/free-solid-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from 'src/app/dialogs/alert-dialog/alert-dialog.component';
import { BookingsService } from 'src/app/core/services/bookings.service';

@Component({
  selector: 'app-availability',
  templateUrl: './availability.component.html',
  styleUrls: ['./availability.component.css']
})
export class AvailabilityComponent implements OnInit {
  dateNow: Date = new Date();
  avail: any  = [];
  notAvailableRoom: any  = [];
  logged_in_branch: any  = [];
  rooms: any = [];
  rooms_grid: any = [];
  faBedEmpty: any = faBed;
  pageSize: any = 100;
  pageIndex: any = 0;
  searchData: any = '';
  
  spinner: boolean = false;
  constructor(
    public mem: MemberService,
    public book: BookingsService,
    public main: MainService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.logged_in_branch = this.main.getCurrentUserBranch();
    this.getAvailabilityByBranch();
    this.getCurrentTimeBookings();
    this.getRooms( this.pageSize, this.pageIndex, this.searchData );    
  }

/*----------------------------------
            Current
-----------------------------------*/
  getCurrentTimeBookings(){
    const data = {
      date: this.dateNow,
      time: this.dateNow.getTime()
    }
    this.book.getCurrentTimeBookings({data: data}).subscribe((res: any) =>{
      if(res.success){
        this.notAvailableRoom = res.response || [];      
      }     
    });
  }

/*----------------------------------
             Rooms
-----------------------------------*/
  
  getRooms(size: any, i: any, s: any){
    this.main.getRooms({size:size, index: i, search: s}).subscribe((res: any) =>{
      this.rooms = res.success ? res.response : [];
      this.rooms_grid = res.success ? res.response : [];
      this.rooms_grid.forEach((el: any, index: any) => {   
          el.status = this.compareAvailability(el, this.notAvailableRoom);
          const y = this.loopData(el.room_pax, el.room_pax_status);
          el.pax_array = y;
      });         
    });
  }
  
  loopData(x: any, y: any){
    let beds: any = [];
    for(let i = 1; i <= x; i++) {
      beds.push({
        bed: i,
        bed_status: y ? y.split(",") : 1, 
      });
    }
    return beds;
  }

  compareAvailability(a: any, b: any){
    let status: any;
    b.forEach((element: any) => {   
       status = element.room_id === a.room_id;
    });
    return status;
  }


/*----------------------------------
             Therapists
-----------------------------------*/

  
  getAvailabilityByBranch(){
    this.mem.getAvailabilityByBranch({data: this.logged_in_branch}).subscribe((res: any) =>{
      this.avail = res.success ? res.response : [];
    })
  }

  drop(event: CdkDragDrop<string[]>) {    
    moveItemInArray(this.avail, event.previousIndex, event.currentIndex);
    this.reorderAvailMembers(this.avail);
    
  }

  reorderAvailMembers(x: any){
    this.mem.reorderAvailMembers({data: x}).subscribe((res: any ) =>{
      if(res.success){
        this.getAvailabilityByBranch();
        this.main.snackbar(res.response, 'X', 2000, 'primary-panel');
      } else {
        this.main.snackbar(res.response, 'X', 2000, 'warn-panel');
      }
    })
  }

  resetAll(){    
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      width: '500px',
      data: {
        message: 'Are you sure you want to reset all? All ordered therapist will be removed on the list and all rooms will be available.',
        component: '',
        data: ''
      },
    });
    dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.spinner = true;
            this.mem.truncateAvailabilities().subscribe((res: any) =>{
                if(res.success){
                  this.main.snackbar(res.response, 'X', 2000, 'primary-panel');
                  setTimeout((r: any) =>{
                      this.getAvailabilityByBranch();
                      this.getRooms( this.pageSize, this.pageIndex, this.searchData );                      
                      this.spinner = false;
                  }, 1500)
                } else {
                  this.main.snackbar('Resetting Failed', 'X', 2000, 'primary-panel');
                }
            })
        } 
    });
  }

}
