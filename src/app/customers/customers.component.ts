import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CustomerService } from '../core/services/customer.service';
import {MainService} from '../core/services/main.service'
import { AlertDialogComponent } from '../dialogs/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  page: any = 1;
  historyDisplayedColumns: string[] = [
    'cus_name',
    'cus_no',
    'cus_note',
    'cus_cat',
    'action'
  ]; 
  historyDataSource = new MatTableDataSource([]);
  customers: any =[];
  customerCat: any =[];
  customerForm!: FormGroup;
  
  pageSizeOptions: number[] = [5, 20, 50];
  pageSize: any = 10;
  pageLength: any;
  pageIndex: any = 0;
  currentIndex: any = 0;

  toAdd: boolean = true;
  searchCustomerInput: any ='';

  constructor(
          private fb: FormBuilder,
          private cus: CustomerService,
          private main: MainService,
          private dialog: MatDialog,
      ) { }

  ngOnInit(): void {
    this.initiateForm();  
    this.getCustomerCategory();
    this.getCustomers();
  }

  initiateForm(){
    this.customerForm = this.fb.group({
      cus_id: [''],
      cus_name: ['', Validators.required],
      cus_no: ['',  Validators.required],
      cus_cat_id: [''],
      cus_date: [''],
      cus_note: [''],
    });
  }

  patchCustomerForm(data: any){
    this.toAdd = false;
    this.customerForm = this.fb.group({
      cus_id: [data.cus_id],
      cus_name: [data.cus_name],
      cus_no: [data.cus_no],
      cus_cat_id: [data.cus_cat_id],
      cus_date: [data.cus_date],
      cus_note: [data.cus_note],
    });
  }

  searchCustomer(){
    if(this.pageIndex !== 0) {
        this.currentIndex = 0;
        this.pageIndex = 0;
      }      
      this.cus.searchCustomers({size: this.pageSize, search: this.searchCustomerInput, index: this.currentIndex}).subscribe((results: any) =>{
          this.customers = results.success ? results.response : [];
          this.pageLength = results.success ? results.length : this.pageLength;
          this.historyDataSource = this.customers;
      });    
  }

  alertMessage(data: any){
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      width: '500px',
      data: {
        component: 'customer',
        message: 'Are you sure you want to remove this customer?',
        data: data.cus_id}
    });
    dialogRef.afterClosed().subscribe(result => {
        if(result){
            this.toRemoveCustomer(data.cus_id);
        }
    }); 
  }

  back(){
    this.toAdd = true;
    this.initiateForm();
  }

  getCustomers(){
    this.cus.searchCustomers({size: this.pageSize, search: this.searchCustomerInput, index: this.currentIndex}).subscribe((results: any) =>{
        this.customers = results.success ? results.response : [];
        this.pageLength = results.success ? results.length : this.pageLength;
        this.historyDataSource = this.customers;
    });
  }

  getCustomerCategory(){
    this.cus.getCustomersCategories().subscribe((results: any) =>{
        this.customerCat = results.success ? results.response : [];
    });
  }

  addCustomer(){
    if(this.customerForm.valid){
      this.customerForm.get('cus_name')!.value.toLowerCase;
      this.cus.addCustomer({data: this.customerForm.getRawValue()}).subscribe((result: any) =>{
        if(result.success){
            this.main.snackbar('Adding Customer Successful!.', 'X', 2000, 'primary-panel');
            this.initiateForm();
            this.getCustomers();
        } else {
            this.main.snackbar('Adding Customer Failed.', 'X', 2000, 'warn-panel');
        }
      })
    }
  }


  updateCustomer(){
    if(this.customerForm.valid){
      this.cus.updateCustomer({data: this.customerForm.getRawValue(), id: this.customerForm.get('cus_id')!.value}).subscribe((result: any) =>{
        if(result.success){
            this.main.snackbar('Updating Customer Successful!.', 'X', 2000, 'primary-panel');
            this.getCustomers();
            this.customerForm.reset();
        } else {
            this.main.snackbar('Updating Customer Failed.', 'X', 2000, 'warn-panel');
        }
      })
    }
  }

  toRemoveCustomer(id: any){
    const data = {deleted: 1}
    this.cus.updateCustomer({data: data, id: id}).subscribe((result: any) =>{
      if(result.success){
          this.main.snackbar('Removed Customer Successful!.', 'X', 2000, 'primary-panel');
          this.getCustomers();
          this.customerForm.reset();
      } else {
          this.main.snackbar('Removed Customer Failed.', 'X', 2000, 'warn-panel');
      }
    })
  }

  handlePageEvent(event: PageEvent) {     
      this.pageSize = event.pageSize;
      this.pageIndex = event.pageIndex;
      this.currentIndex = this.pageSize * this.pageIndex;  
      this.getCustomers();
  }


}
