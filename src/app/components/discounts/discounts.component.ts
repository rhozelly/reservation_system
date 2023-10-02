import { Component, OnInit, ViewChild } from '@angular/core';
import { MainService } from 'src/app/core/services/main.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertDialogComponent } from 'src/app/dialogs/alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-discounts',
  templateUrl: './discounts.component.html',
  styleUrls: ['./discounts.component.css']
})
export class DiscountsComponent implements OnInit {
  discounts: any =[];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = ['disc_name','disc_percent', 'action'];  
  dataSource = new MatTableDataSource([]);
  discountForm!: FormGroup;

  actions: boolean = true;
  search: any = "";

  privs: any = [];
  privsArray: any = [];

  constructor(
    private main: MainService,
    private fb: FormBuilder,
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
    this.discountForm = this.fb.group({
      disc_name: ['', Validators.required],
      disc_percent: ['', Validators.required],
      disc_id: [''],
    });
    this.getDiscounts(this.search);
  }

  patchDiscountValues(data: any){
    this.actions = false;
    this.discountForm = this.fb.group({
      disc_name: [data.disc_name],
      disc_percent: [data.disc_percent],
      disc_id: [data.disc_id],
    });
  }

  getDiscounts(data: any){
    this.main.getDiscounts({data: data}).subscribe((res: any) =>{
      this.discounts = res.success ? res.response : [];
      this.dataSource = this.discounts;
    });
  }

  resetForm(){
    this.discountForm.reset();
    this.actions = true;
  }

  searchData(){
    this.getDiscounts(this.search);
  }

  addDiscount(){
    if(this.discountForm.valid){
      if(this.actions){
        this.main.addDiscount({data: this.discountForm.getRawValue()}).subscribe((res: any) =>{
          if(res.success){
            this.discountForm.reset();
            this.getDiscounts(this.search);
            this.main.snackbar(res.response, 'X', 2000, 'primary-panel');
          } else {
            this.main.snackbar('Failed in adding discount.', 'X', 2000, 'warn-panel');
          }
        });        
      } else {
        this.main.updateDiscount({data: this.discountForm.getRawValue(), id: this.discountForm.get('disc_id')!.value}).subscribe((res: any) =>{
          if(res.success){
            this.actions = true;
            this.discountForm.reset();
            this.getDiscounts(this.search);
            this.main.snackbar(res.response, 'X', 2000, 'primary-panel');
          } else {
            this.main.snackbar('Failed in updating discount.', 'X', 2000, 'warn-panel');
          }
        });    
      }
    } else {
      this.main.snackbar('Please answer the required fields.', 'X', 2000, 'warn-panel');
    }
  }

  
  alertMessage(x:any){
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      width: '250px',
      data: {
        message: 'Are you sure you want to remove this discount?',
        component: 'discount',
        data: x.cus_cat_id
      },
    }); 
    dialogRef.afterClosed().subscribe(result => {
      this.getDiscounts(this.search);
      this.actions = true;
    });
  }

}
