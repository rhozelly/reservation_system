import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ignoreElements } from 'rxjs';
import { AccountService } from 'src/app/core/services/account.service';
import { MainService } from 'src/app/core/services/main.service';
import {AlertDialogComponent} from "../alert-dialog/alert-dialog.component";

@Component({
  selector: 'app-setting-dialog',
  templateUrl: './setting-dialog.component.html',
  styleUrls: ['./setting-dialog.component.css']
})
export class SettingDialogComponent implements OnInit {
  branches: any =[];
  accounts: any =[];
  privs: any =[];
  roles: any =[];
  pageLength: any = 0;
  accountForm!: FormGroup;
  branchForm!: FormGroup;
  matchpassword: any = '';
  selectedAccId: any ='';
  hidePassword: any = 'password';
  hideMatchPassword: any = 'password';
  patchedBranch: boolean = false;
  patchedAccount: boolean = false;
  passwordHintMessage: any = '';
  passwordHintBoolean: boolean = false;
  newPassword: any;
  newPasswordMatch: any;

  
  branchPageSize: any = 5;
  branchPageLength: any = 0;
  branchPageIndex: any = 0;
  
  accountpageSizeOptions: number[] = [5, 10];
  accountPageSize: any = 5;
  accountPageLength: any = 0;
  accountPageIndex: any = 0;

  savePrivilegesButton: boolean = false;
  spinner: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = [
    'prof_name',
    'acc_uname',
    'branch_name',
    'action',
  ];
  branchColumns: string[] = [
    'branch_name',
    'branch_address',
    'action',
  ];
  dataSource = new MatTableDataSource([]);
  branchSource = new MatTableDataSource([]);
  constructor(
    public dialogRef: MatDialogRef<SettingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private acc: AccountService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private main: MainService) { }

  ngOnInit(): void {
    this.initiateAccountForm();
    this.initiateBranchForm();

    this.accountForm.get('acc_pass')!.valueChanges.subscribe((value: any) =>{
      if(value && value.length > 0){
        console.log(value);
      }
    });
    this.getBranch();
    this.getRoles();    
    this.getAccountAndProfile( this.accountPageSize, this.accountPageIndex);
  }

  initiateAccountForm(){
    this.accountForm = this.fb.group({
      prof_name: ['', Validators.required],
      acc_uname: ['', Validators.required],
      acc_pass: ['', Validators.required],
      branch_id: ['', Validators.required],
      priv_id: ['', Validators.required],
    });
  }

  initiateBranchForm(){
    this.branchForm = this.fb.group({
      branch_name: ['', Validators.required],
      branch_address: ['', Validators.required],
      branch_id: [''],
    });
  }

  resetForms(x: any){
    if(x === 'accounts') {
      this.patchedAccount = false;
      this.initiateAccountForm();
    } else if(x === 'branches') {
      this.initiateBranchForm();
      this.patchedBranch = false;
    }
  }

  patchValues(data: any){
    this.accountForm = this.fb.group({
      prof_name: [data.prof_name],
      acc_uname: [data.acc_uname],
      acc_pass: [''],
      branch_id: [data.branch_id],
      priv_id: [data.priv_id],
    });
    this.patchedAccount = true;
  }

  patchBranchValues(data: any){
    this.branchForm = this.fb.group({
      branch_name: [data.branch_name],
      branch_address: [data.branch_address],
      branch_id: [data.branch_id],
    });
    this.patchedBranch = true;
  }

  getRoles(){
    this.main.getPrivs().subscribe((res: any) =>{
      this.roles = res.success ? res.response : [];
    });
  }

  getPrivs(i: any){
    console.log(i);
    
    this.main.getPrivOfTheAccount({data: i}).subscribe((res: any) =>{
      this.privs = res.success ? res.response : [];
    });
  }

  getBranch(){
    this.main.getBranches().subscribe((res: any) =>{
      this.branches = res.success ? res.response : [];
      this.branchSource = this.branches;
    });
  }
  
  handlePageEvent(event: PageEvent) {
    this.branchPageSize = event.pageSize;
    this.branchPageIndex = event.pageIndex;
    let currentIndex = this.branchPageSize * this.branchPageIndex;
    this.getAccountAndProfile( this.accountPageSize, currentIndex);
  }

  getAccountAndProfile(size: any, index: any){
    this.acc.getAccountAndProfile({size: size, index: index}).subscribe((res: any) =>{
      this.accounts = res.success ? res.response : [];
      this.accountPageLength = res.success ? res.total_data.total_data : 0;
      this.dataSource = this.accounts;
    });
  }

  alertMessage(x: any, y: any){
    if(x === 'accounts'){
      const dialogRef = this.dialog.open(AlertDialogComponent, {
        width: '250px',
        data: {
          message: 'Are you sure you want to remove this account?',
          component: 'account',
          data: {acc_id: y.acc_id, prof_id: y.prof_id}
        },
      });
      dialogRef.afterClosed().subscribe(result => {
        this.getAccountAndProfile( this.accountPageSize, this.accountPageIndex);
      });
    } else if(x === 'branches'){
      const dialogRef = this.dialog.open(AlertDialogComponent, {
        width: '250px',
        data: {
          message: 'Are you sure you want to remove this branch?',
          component: 'branch',
          data: y.branch_id
        },
      });
      dialogRef.afterClosed().subscribe(result => {
        this.getBranch();
      });
    }
  }

  checkMatchPassword(){
    if(this.matchpassword.length > 0){
        if(this.matchpassword === this.accountForm.get('acc_pass')?.value){
            this.passwordHintMessage = 'Password Matched!';
            this.passwordHintBoolean = true;
        } else {
            this.passwordHintMessage = "Password Doesn't Matched!";
            this.passwordHintBoolean = false;
        }
    } else {
      this.passwordHintMessage = "";
    }
  }

  
  checkNewMatchPassword(){
    if(this.newPasswordMatch.length > 0){
        if(this.newPasswordMatch === this.newPassword){
            this.passwordHintMessage = 'Password Matched!';
            this.passwordHintBoolean = true;
        } else {
            this.passwordHintMessage = "Password Doesn't Matched!";
            this.passwordHintBoolean = false;
        }
    } else {
      this.passwordHintMessage = "";
    }
  }

  selectedAccount() {    
    this.getPrivs(this.selectedAccId); 
  }

  submit(x: any){
    if(x === 'accounts') {
      if(this.accountForm.valid){      
          this.acc.addAccountAndProfile({data: this.accountForm.getRawValue()}).subscribe((res: any) =>{
            if(res.success) {
              this.main.snackbar(res.response, 'x', 2000, 'primary-panel');
              this.initiateAccountForm();
              this.getAccountAndProfile( this.accountPageSize, this.accountPageIndex);
            } else {          
              this.main.snackbar('Adding account failed', 'x', 2000, 'warn-panel');
            }
          })
      } else {
        this.main.snackbar('Please complete the fields.', 'x', 2000, 'warn-panel');
      }
    } else if(x === 'branches') {      
      if(this.branchForm.valid){ 
          this.main.addBranch({data: this.branchForm.getRawValue()}).subscribe((res: any) =>{
            if(res.success) {
              this.main.snackbar(res.response, 'x', 2000, 'primary-panel');
              this.initiateBranchForm();
              this.getBranch();
            } else {          
              this.main.snackbar('Adding branch failed', 'x', 2000, 'warn-panel');
            }
          });
      } else {        
        this.main.snackbar('Please complete the fields.', 'x', 2000, 'warn-panel');
      }
    }
  }

  update(x: any){
    if(x === 'accounts') {
      if(this.accountForm.valid){      
          
      } else {
        this.main.snackbar('Please complete the fields.', 'x', 2000, 'warn-panel');
      }
    } else if(x === 'branches') {    
      console.log(this.branchForm.getRawValue());
        
      if(this.branchForm.valid){ 
          this.main.updateBranch({data: this.branchForm.getRawValue()}).subscribe((res: any) =>{
            if(res.success) {
              this.main.snackbar(res.response, 'x', 2000, 'primary-panel');
              this.initiateBranchForm();
              this.getBranch();
            } else {          
              this.main.snackbar('Updating branch failed', 'x', 2000, 'warn-panel');
            }
          });
      } else {        
        this.main.snackbar('Please complete the fields.', 'x', 2000, 'warn-panel');
      }
    }
  }

  savePrivs(){
    let result_array = false;
    this.privs.forEach((e: any) =>{
        this.spinner = true;
        this.savePrivilegesButton = true;
        this.main.updatePrivilegesSettings({data: e}).subscribe((res: any) => {         
            result_array = res.success;
        });
        return result_array;
    });
    setTimeout((t: any) => {      
      this.spinner = false;
      this.savePrivilegesButton = false;
        if(result_array){
          this.main.snackbar('Updating privileges success', 'x', 2000, 'primary-panel');  
        } else {
          this.main.snackbar('Updating privileges failed', 'x', 2000, 'warn-panel');          
        }
    }, 2000);
  }

}
