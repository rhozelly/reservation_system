import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MainService} from "../../../core/services/main.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-add-room',
  templateUrl: './add-room.component.html',
  styleUrls: ['./add-room.component.css']
})
export class AddRoomComponent implements OnInit {
  roomForm!: FormGroup;
  roomsGroup: any = [];
  roomStatus: any = ['available', 'not available'];
  roomCategories: any = ['individual', 'couple', 'family', 'connecting', ];
  actionUrl: any = '';
  roomId: any;
  branches: any = [];
  currentBranch: any;
  constructor(
    private fb: FormBuilder,
    private main: MainService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.currentBranch = this.main.getCurrentUserBranch();
    const splitted_url = this.router.url.split('/');
    if(splitted_url.length >= 3){
      const action = splitted_url[2].split('-');
      this.actionUrl = action[0];
      if(this.actionUrl === 'update'){
        this.roomId = this.route.snapshot.params;
        this.getRoomByRoomId(this.roomId.data );
      }
    }
    this.getBranch();

    this.roomForm = this.fb.group({
      room_id: [''],
      room_name: ['', Validators.required],
      room_cat: ['', Validators.required],
      room_pax: ['', Validators.required],
      room_pax_status: [''],
      room_status: [1],
      branch_id: [''],
    });

    this.roomForm.get('room_pax')?.valueChanges.subscribe(val =>{
      const x = this.loopData(this.roomForm.get('room_pax')!.value);
      const y = x.join(',');
      this.roomForm.get('room_pax_status')?.setValue(y);
    })
  }

  getBranch(){
    this.main.getBranches().subscribe((res: any) =>{
      this.branches = res.success ? res.response : [];
    });
  }

  getRoomByRoomId(x: any){
    this.main.getRoomByRoomId({data: x}).subscribe((res: any) =>{
      if(res.success){
        this.patchValues(res.response[0]);
      }
    })
  }

  patchValues(data: any){
    this.roomForm = this.fb.group({
      room_id: [data.room_id],
      room_name: [data.room_name],
      room_cat: [data.room_cat],
      room_pax: [data.room_pax],
      room_status: [data.room_status],
      branch_id: [data.branch_id],
    });
  }

  back(){
    this.router.navigate([this.main.getCurrentUserPrivileges() + '/rooms']);
  }

  
  loopData(x: any){
    let a: any = [];
    for(let i = 1; i <= x; i++) {
      a.push("0");
    }
    return a;
  }


  submit(){    
    if(this.roomForm.valid){
      if(this.actionUrl === 'add') {
        this.roomForm.get('branch_id')?.setValue(this.currentBranch);
        this.main.addRoom({data: this.roomForm.getRawValue()}).subscribe((res: any) => {
          if (res.success) {
            this.main.snackbar(res.response, 'X', 2000, 'primary-panel');
            this.router.navigate([this.main.getCurrentUserPrivileges() + '/rooms']);
            this.roomForm.reset();
          } else {
            this.main.snackbar('Adding Room Failed.', 'X', 2000, 'warn-panel');
          }
        })
      } else if(this.actionUrl === 'update') {
        this.main.updateRoom({data: this.roomForm.getRawValue()}).subscribe((res: any) => {
          if (res.success) {
            this.main.snackbar(res.response, 'X', 2000, 'primary-panel');
            this.router.navigate([this.main.getCurrentUserPrivileges() + '/rooms']);
            this.roomForm.reset();
          } else {
            this.main.snackbar('Updating Room Failed.', 'X', 2000, 'warn-panel');
          }
        })
      }
    } else {
      this.main.snackbar('Please answer all the fields.', 'X', 2000, 'warn-panel');
    }
  }


}
