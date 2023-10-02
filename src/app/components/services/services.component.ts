import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { Router } from '@angular/router';
import { MainService } from 'src/app/core/services/main.service';
import { AlertDialogComponent } from 'src/app/dialogs/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  // @Input()  searchData!: any;
  displayedColumns: string[] = [
    'service_id',
    'service_code',
    'item_code',
    'service_name',
    'service_dur',
    'service_group',
    'service_price',
    'action',
  ];
  dataSource = new MatTableDataSource([]);
  services: any = [];
  pageSizeOptions: number[] = [5, 10, 20];
  pageSize: any = 10;
  pageLength: any;
  pageIndex: any = 0;
  searchData: any = '';
  privs: any  = [];
  privsArray: any  = [];

  constructor(
    private main: MainService,
    private router: Router,
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
    this.getServices( this.pageSize, this.pageIndex, this.searchData );
  }

  searchbar(){
    this.getServices( this.pageSize, this.pageIndex, this.searchData );
  }

  getServices(size: any, i: any, s: any){
    this.main.getServices({size:size, index: i, search: s}).subscribe((res: any) =>{
        this.services = res.success ? res.response : [];
        this.pageLength = res.success ? res.length : [];
        this.dataSource = this.services;
    })
  }

  addService(){
    this.router.navigate([this.main.getCurrentUserPrivileges() + '/add-service']);
  }

  editService(id: any){
    this.router.navigate([`${this.main.getCurrentUserPrivileges()}/update-service`,{data: id}])
  }

  alertMessage(x: any){
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      width: '250px',
      data: {
        message: 'Are you sure you want to remove this service?',
        component: 'services',
        data: x.service_id
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.getServices( this.pageSize, this.pageIndex, this.searchData );
      }
    });
  }


  handlePageEvent(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    let currentIndex = this.pageSize * this.pageIndex;
    this.getServices( this.pageSize, currentIndex, this.searchData );
  }

}
