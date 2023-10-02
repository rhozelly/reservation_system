import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { Router } from '@angular/router';
import { MainService } from 'src/app/core/services/main.service';
import { MemberService } from 'src/app/core/services/member.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from 'src/app/dialogs/alert-dialog/alert-dialog.component';
import {MatSlideToggleChange} from "@angular/material/slide-toggle";

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css']
})
export class MembersComponent implements OnInit {
  members: any = [];
  allMembers: any = [];
  slide: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = ['in', 'name', 'status','action'];
  dataSource = new MatTableDataSource([]);

  pageSizeOptions: number[] = [5, 10, 20];
  pageSize: any = 10;
  pageLength: any;
  pageIndex: any = 0;
  searchData: any = '';
  isChecked: any;
  currentIndex: any;
  
  privs: any = [];
  privsArray: any = [];

  branchNow: any;
  progressLoader: any = false;;

  constructor(
    private mem: MemberService,
    private main: MainService,
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {     
    this.main.getNavsWithPrivs({data: this.main.getCurrentUserAccId()}).subscribe((res: any) =>{
      if(res.success){
        this.privs = res.response || [];
        this.privs.forEach((e: any) => {
            if(e.nav_name === 'therapist'){
              this.privsArray = e;
            }
        });               
      }
    })
    this.dataSource.paginator = this.paginator;
    this.getMembers(this.pageSize, this.pageIndex, this.searchData);
  }

  toggle(x: any, e: any) {
    const a = {
      mem_id: x.mem_id,
      branch_id: x.branch_id
    };
    if(e.checked === true){
      this.addMemberToOrder(a, e.checked);  
      this.addMemberToOrderInLogs(a, e.checked);
    } else {
      this.sliderOff(a);
    }
  }

  setEveryoneToTimeIn(){
    this.progressLoader = true;
    this.allMembers.forEach((value: any) =>{
      const a = {
        mem_id: value.mem_id,
        branch_id: value.branch_id
      };
      this.addMemberToOrder(a, true);  
      this.addMemberToOrderInLogs(a, true);
    })
    setTimeout((val: any) =>{
      this.afterTimingInEveryone();
    }, 3000)
  }

  afterTimingInEveryone(){
    this.main.snackbar('Successfully Added Member to Order', 'X', 2000, 'primary-panel');
    this.getMembers(this.pageSize, this.pageIndex, this.searchData);
    this.progressLoader = false;
  }

  editMember(x: any){
    this.router.navigate([`${this.main.getCurrentUserPrivileges()}/update-therapist`,{data: x}]);
  }

  getAllMembers(){
    this.mem.getMembersByBranch({data: this.members[0].branch_id}).subscribe((result: any) =>{
        this.allMembers = result.success ? result.response : [];
    })
  }


  addNewMember(){
    this.router.navigate([this.main.getCurrentUserPrivileges() + '/add-therapist']);
  }

  getMembers(size: any, i: any, s: any){
    this.mem.getMembers({size:size, index: i, search: s}).subscribe((res: any) =>{      
      this.members = res.success ? res.response : [];
      this.pageLength = res.success ? res.length : [];
      this.dataSource = this.members;
      this.getAllMembers();
    })
  }

  alertMessage(x:any){
      const dialogRef = this.dialog.open(AlertDialogComponent, {
        width: '250px',
        data: {
          message: 'Are you sure you want to remove this member?',
          component: 'therapist',
          data: x.mem_id
        },
      });

      dialogRef.afterClosed().subscribe(result => {
        this.getMembers(this.pageSize, this.pageIndex, this.searchData);
      });
  }

  
  sliderOff(x:any){
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      width: '250px',
      data: {
        message: 'Are you sure you want to remove the therapist from the order? If so, all the service total from today will be removed.',
        component: 'slider-off',
        data: x.mem_id,
        content: x
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getMembers(this.pageSize, this.pageIndex, this.searchData);
    });
}

  searchbar(){
    if(this.pageIndex !== 0) {
        this.currentIndex = 0;
        this.pageIndex = 0;
      }  
    this.getMembers( this.pageSize, this.pageIndex, this.searchData );
  }


  handlePageEvent(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.currentIndex = this.pageSize * this.pageIndex;
    this.getMembers( this.pageSize, this.currentIndex, this.searchData );
  }

  addMemberToOrder(e: any, checked: any){
    this.mem.addMemberToOrder({data: e, checked: checked}).subscribe((res: any) =>{
      if (res.success) {
        const data = { mem_in: checked };
        this.updateMember(data, e.mem_id);
      } else {
        this.main.snackbar('Adding Member to Order Failed.', 'X', 2000, 'warn-panel');
      }
    })
  }

  addMemberToOrderInLogs(e: any, checked: any){
    this.mem.addMemberToOrderInLogs({data: e, checked: checked}).subscribe((res: any) =>{
      if (res.success) {
      } else {
      }
    })
  }

  updateMember(data: any, id: any){
    this.mem.updateMembers({data: data, id: id}).subscribe((res: any) =>{
      if (res.success) {
        if(!this.progressLoader){
          this.main.snackbar('Successfully Added Member to Order', 'X', 2000, 'primary-panel');
        }
      } else {
        this.main.snackbar('Adding Member to Order Failed.', 'X', 2000, 'warn-panel');
      }
    })
  }

}
