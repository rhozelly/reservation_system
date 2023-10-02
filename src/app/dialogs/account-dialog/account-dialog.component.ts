import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AccountService } from 'src/app/core/services/account.service';
import { MainService } from 'src/app/core/services/main.service';

@Component({
  selector: 'app-account-dialog',
  templateUrl: './account-dialog.component.html',
  styleUrls: ['./account-dialog.component.css']
})
export class AccountDialogComponent implements OnInit {
  accounts: any = [];
  accountForm!: FormGroup;
  profileForm!: FormGroup;
  hideConfirmPass = true;
  hideChangePass = true;

  constructor(
    public dialogRef: MatDialogRef<AccountDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private main: MainService,
    private acc: AccountService
    
    ) { }

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      prof_id: [''],
      prof_name: ['', Validators.required],
      prof_num: [''],
      prof_address: [''],
    });
    this.accountForm = this.fb.group({
      acc_id: [''],
      acc_uname: ['', Validators.required],
      acc_pass: [''],
    });
    this.getAccount();
  }

  getAccount(){
    this.acc.getTheAccount({data: this.main.getCurrentUserAccId()}).subscribe((res: any) =>{
        this.accounts = res.success ? res.response : [];
        this.patchForms(this.accounts);
    });
  }

  patchForms(data: any){    
    this.profileForm = this.fb.group({
      prof_id: [data.prof_id],
      prof_name: [data.prof_name, Validators.required],
      prof_num: [data.prof_num],
      prof_address: [data.prof_address],
    });
    this.accountForm = this.fb.group({
      acc_id: [data.acc_id],
      acc_uname: [data.acc_uname, Validators.required],
      acc_pass: [''],
    });
  }

  submit(){
    console.log(this.profileForm.valid, 'prof');
    console.log(this.accountForm.valid, 'creds');
    
    if(this.profileForm.valid){
      this.updateProfile();
    }

    if(this.accountForm.valid){
      this.updateAccount();
    }
  }

  updateProfile(){
    this.acc.updateProfile({data: this.profileForm.getRawValue(), id: this.profileForm.get('prof_id')?.value}).subscribe((res: any) =>{
      if(res.success){
        this.getAccount();
        this.main.snackbar(res.response, 'X', 2000, 'primary-panel');
      } else {
        this.main.snackbar('Update Failed!', 'X', 2000, 'warn-panel');
      }
    })
  }

  updateAccount(){
    let accountData;
    if(this.accountForm.get('acc_pass')?.value.length > 0) {
          accountData = this.accountForm.getRawValue();
    } else {
        accountData = {
          acc_uname: this.accountForm.get('acc_uname')?.value,
          acc_id: this.accountForm.get('acc_id')?.value
        }
    }
    this.acc.updateAccount({data: accountData, id: this.accountForm.get('acc_id')?.value}).subscribe((res: any) =>{
      if(res.success){
        this.getAccount();
        this.main.snackbar(res.response, 'X', 2000, 'primary-panel');
      } else {
        this.main.snackbar('Update Failed!', 'X', 2000, 'warn-panel');
      }
    })
  }

}
