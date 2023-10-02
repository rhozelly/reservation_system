import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CustomerService } from 'src/app/core/services/customer.service';
import { MainService } from 'src/app/core/services/main.service';
import { AlertDialogComponent } from 'src/app/dialogs/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-classification',
  templateUrl: './classification.component.html',
  styleUrls: ['./classification.component.css']
})
export class ClassificationComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = ['cus_cat_name','cus_cat_desc', 'actions'];  
  dataSource = new MatTableDataSource([]);

  classifications: any =[];
  classificationForm!: FormGroup;
  
  actions: boolean = true;

  privs: any = [];
  privsArray: any = [];
  search: any;

  constructor(
                private fb: FormBuilder,
                private main: MainService,
                private cus: CustomerService,
                private dialog: MatDialog,
              ) { }

  ngOnInit(): void {
    this.main.getNavsWithPrivs({data: this.main.getCurrentUserAccId()}).subscribe((res: any) =>{
      if(res.success){
        this.privs = res.response || [];
        this.privs.forEach((e: any) => {
            if(e.nav_name === 'discounts'){
              this.privsArray = e;
            }
        });               
      }
    })
    this.initiateForm();
    this.getCustomerCategory();
  }

  searchClassification(search: any){
    this.cus.searchCustomerCategory({search: search}).subscribe((res: any) =>{
      console.log(res);
      
      if(res.success){
        this.classifications = res.success ? res.response : [];
        this.dataSource = this.classifications;
      }
    })
  }
  
  initiateForm(){
    this.classificationForm = this.fb.group({
      cus_cat_id: [''],
      cus_cat_name: ['', Validators.required],
      cus_cat_desc: [''],
    })
  }

  getCustomerCategory(){
    this.cus.getCustomersCategories().subscribe((res: any) =>{
      this.classifications = res.success ? res.response : [];
      this.dataSource = this.classifications;
    })
  }

  patchClassificationsValues(data: any){
    this.actions = false;
    this.classificationForm = this.fb.group({
      cus_cat_id: [data.cus_cat_id],
      cus_cat_name: [data.cus_cat_name],
      cus_cat_desc: [data.cus_cat_desc],
    });

  }

  alertMessage(x:any){
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      width: '250px',
      data: {
        message: 'Are you sure you want to remove this classification?',
        component: 'classification',
        data: x.cus_cat_id
      },
    }); 
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.actions = true;
        this.removeCustomerCategories(x.cus_cat_id);
      }
    });
  }

  addClassification(){
    if(this.classificationForm.valid){
      if(this.actions){
        this.cus.addCustomerCategories({data: this.classificationForm.getRawValue()}).subscribe((res: any) =>{
          if(res.success){
            this.getCustomerCategory();
            this.classificationForm.reset();
            this.main.snackbar('Successful in adding classification', 'X', 2000, 'primary-panel');
          } else {
            this.main.snackbar('Failed in adding classification.', 'X', 2000, 'warn-panel');
          }
        });        
      } else {
        this.cus.updateCustomerCategories({data: this.classificationForm.getRawValue(), id: this.classificationForm.get('cus_cat_id')!.value}).subscribe((res: any) =>{
          if(res.success){
            this.getCustomerCategory();
            this.actions = true;
            this.classificationForm.reset();
            this.main.snackbar('Successful in updating classification', 'X', 2000, 'primary-panel');
          } else {
            this.main.snackbar('Failed in updating classification.', 'X', 2000, 'warn-panel');
          }
        });    
      }
    } else {
      this.main.snackbar('Please answer the required fields.', 'X', 2000, 'warn-panel');
    }
  }

  removeCustomerCategories(id: any){
    this.cus.removeCustomerCategories({id: id}).subscribe((res: any) =>{
      if(res.success){
        this.getCustomerCategory();
        this.actions = true;
        this.classificationForm.reset();
        this.main.snackbar('Successful in removing classification', 'X', 2000, 'primary-panel');
      } else {
        this.main.snackbar('Failed in removing classification.', 'X', 2000, 'warn-panel');
      }
    });    
  }
}
