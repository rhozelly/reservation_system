import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import { MainService } from 'src/app/core/services/main.service';
import {MemberService} from "../../../core/services/member.service";

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.css']
})
export class AddMemberComponent implements OnInit {
  addMemberForm!: FormGroup;
  branches: any = [];
  actionUrl: any = '';
  memberId: any;
  memberStatus: any = ['available', 'not available', 'absent'];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private main: MainService,
    private mem: MemberService,
    private route: ActivatedRoute
    ) { }

  ngOnInit(): void {
    const splitted_url = this.router.url.split('/');
    if(splitted_url.length >= 3){
      const action = splitted_url[2].split('-');
      this.actionUrl = action[0];
      if(this.actionUrl === 'update'){
        this.memberId = this.route.snapshot.params;
        this.getMemberById(this.memberId.data );
      }
    }
    this.addMemberForm = this.fb.group({
      branch_id: ['', Validators.required],
      mem_name: ['', Validators.required],
      mem_status: [''],
      mem_id: [''],
    });
    this.getBranches();
  }

  getMemberById(x: any){
    this.mem.getMemberById({data: x}).subscribe((res: any) =>{
      if(res.success){
        this.patchValues(res.response[0]);
      }
    })
  }

  patchValues(data: any){
    this.addMemberForm = this.fb.group({
      branch_id: [data.branch_id],
      mem_name: [data.mem_name, Validators.required],
      mem_status: [data.mem_status],
      mem_id: [data.mem_id],
    });
  }

  submit(){
    this.addMemberForm.get('branch_id')?.setValue(this.main.getCurrentUserBranch());
    if(this.addMemberForm.valid){
      if(this.actionUrl === 'add'){
        this.mem.addMembers({data: this.addMemberForm.getRawValue()}).subscribe((res: any) =>{
          if (res.success) {
            this.addMemberForm.reset();
            this.main.snackbar(res.response, 'X', 2000, 'primary-panel');
            this.backMember();
          } else {
            this.main.snackbar('Adding Member Failed.', 'X', 2000, 'warn-panel');
          }
        })
      } else {
        this.mem.updateMembers({data: this.addMemberForm.getRawValue(), id: this.addMemberForm.get('mem_id')!.value}).subscribe((res: any) =>{
          if (res.success) {
            this.main.snackbar(res.response, 'X', 2000, 'primary-panel');
            this.backMember();
          } else {
            this.main.snackbar('Updating Member Failed.', 'X', 2000, 'warn-panel');
          }
        })
      }
    } else {
      this.main.snackbar('Please complete the fields.', 'X', 2000, 'warn-panel');
    }
  }

  getBranches(){
    this.main.getBranches().subscribe((res: any ) =>{
       this.branches = res.success ? res.response : [];
    })
  }

  backMember(){
    this.router.navigate([this.main.getCurrentUserPrivileges() + '/therapist']);
  }

}
