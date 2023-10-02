import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { BookingsService } from 'src/app/core/services/bookings.service';
import { MainService } from 'src/app/core/services/main.service';
import { MemberService } from 'src/app/core/services/member.service';
import {AccountService} from "../../core/services/account.service";

@Component({
  selector: 'app-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.css']
})
export class AlertDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AlertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private mem: MemberService,
    private book: BookingsService,
    private acc: AccountService,
    private main: MainService) { }

  ngOnInit(): void {
    this.data =  this.data ? this.data : {message:'Are you sure?', component: null};
  }

  remove(){    
    console.log(this.data.component);
    
    if(this.data.component === 'therapist') {
      this.mem.deleteMembers({data: this.data.data}).subscribe((res: any) =>{
        if(res.success){
          this.main.snackbar(res.response, 'X', 2000, 'primary-panel');
        } else {
          this.main.snackbar('Removing Failed', 'X', 2000, 'red-panel');
        }
        this.dialogRef.close(res.success);
      })
    } else if (this.data.component === 'services'){
      this.main.deleteService({data: this.data.data}).subscribe((res: any) =>{
        if(res.success){
          this.main.snackbar(res.response, 'X', 2000, 'primary-panel');
        } else {
          this.main.snackbar('Removing Failed', 'X', 2000, 'red-panel');
        }
        this.dialogRef.close(res.success);
      })
    } else if (this.data.component === 'rooms'){
      this.main.deleteRoom({data: this.data.data}).subscribe((res: any) =>{
        if(res.success){
          this.main.snackbar(res.response, 'X', 2000, 'primary-panel');
        } else {
          this.main.snackbar('Removing Failed', 'X', 2000, 'red-panel');
        }
        this.dialogRef.close(res.success);
      })

    } else if (this.data.component === 'discount'){
      this.main.deleteDiscount({data: this.data.data}).subscribe((res: any) =>{
        if(res.success){
          this.main.snackbar(res.response, 'X', 2000, 'primary-panel');
        } else {
          this.main.snackbar('Removing Failed', 'X', 2000, 'red-panel');
        }
        this.dialogRef.close(res.success);
      })
    } else if (this.data.component === 'booking'){
      this.book.deleteBooking({data: this.data.data}).subscribe((res: any) =>{
        if(res.success){
          this.main.snackbar(res.response, 'X', 2000, 'primary-panel');
        } else {
          this.main.snackbar('Removing Failed', 'X', 2000, 'red-panel');
        }
        this.dialogRef.close(res.success);
      })
    }  else if (this.data.component === 'branch'){
      this.main.deleteBranch({data: this.data.data}).subscribe((res: any) =>{
        if(res.success){
          this.main.snackbar(res.response, 'X', 2000, 'primary-panel');
        } else {
          this.main.snackbar('Removing Failed', 'X', 2000, 'red-panel');
        }
        this.dialogRef.close(res.success);
      })
    } else if (this.data.component === 'accounts'){
      this.acc.deleteAccounts({data: this.data.data}).subscribe((res: any) =>{
        if(res.success){
          this.main.snackbar(res.response, 'X', 2000, 'primary-panel');
        } else {
          this.main.snackbar('Removing Failed', 'X', 2000, 'red-panel');
        }
        this.dialogRef.close(res.success);
      })
    } else if(this.data.component === 'slider-off'){    
      this.mem.addMemberToOrder({data: this.data.content, checked: false}).subscribe((res: any) =>{
        if (res.success) {
          const data = { mem_in: false };
          this.updateMember(data, this.data.data);
          this.dialogRef.close(true);
        } else {
          this.main.snackbar('Removing therapist from order failed.', 'X', 2000, 'warn-panel');
        }
      })
    } else {
      this.dialogRef.close(true);
    }
  }

  updateMember(data: any, id: any){
    this.mem.updateMembers({data: data, id: id}).subscribe((res: any) =>{
      if (res.success) {
        this.main.snackbar('Successfully Added Member to Order', 'X', 2000, 'primary-panel');
      } else {
        this.main.snackbar('Removing therapist Failed.', 'X', 2000, 'warn-panel');
      }
    })
  }

}
