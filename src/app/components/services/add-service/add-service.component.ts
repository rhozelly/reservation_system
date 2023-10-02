import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import { MainService } from 'src/app/core/services/main.service';

@Component({
  selector: 'app-add-service',
  templateUrl: './add-service.component.html',
  styleUrls: ['./add-service.component.css']
})
export class AddServiceComponent implements OnInit {
  serviceForm!: FormGroup;
  servicesGroup: any = [];
  actionUrl: any = '';
  serviceId: any;
  branchId: any;
  constructor(
    private fb: FormBuilder,
    private main: MainService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.branchId = this.main.getCurrentUserBranch();
    const splitted_url = this.router.url.split('/');
    if(splitted_url.length >= 3){
      const action = splitted_url[2].split('-');
      this.actionUrl = action[0];
      if(this.actionUrl === 'update'){
        this.serviceId = this.route.snapshot.params;
        this.getServiceById(this.serviceId.data );
      }
    }

    this.serviceForm = this.fb.group({
      service_code: ['', Validators.required],
      item_code: [''],
      service_name: ['', Validators.required],
      service_dur: ['', Validators.required],
      service_group: ['', Validators.required],
      service_price: [''],
      branch_id: [this.branchId],
    });
    this.getServicesGroup();
  }
  getServicesGroup(){
    this.main.getServicesGroup().subscribe((res: any) =>{
      this.servicesGroup = res.success ? res.response : [];
    })
  }

  getServiceById(x: any){
    this.main.getServiceById({data: x}).subscribe((res: any) =>{
      if(res.success){
        this.patchValues(res.response[0]);
      }
    })
  }

  patchValues(data: any){
    this.serviceForm = this.fb.group({
      service_id: [data.service_id],
      service_code: [data.service_code],
      item_code: [data.item_code],
      service_name: [data.service_name],
      service_dur: [data.service_dur],
      service_group: [data.service_group_id],
      service_price: [data.service_price],
      branch_id: [data.branch_id],
    });
  }


  submit(){
    console.log(this.serviceForm.valid);
    
    if(this.serviceForm.valid){
      if(this.actionUrl === 'add') {
        this.main.addService({data: this.serviceForm.getRawValue()}).subscribe((res: any) => {
          if (res.success) {
            this.main.snackbar(res.response, 'X', 2000, 'primary-panel');
            this.back();
          } else {
            this.main.snackbar('Adding Service Failed.', 'X', 2000, 'warn-panel');
          }
        })
      } else if(this.actionUrl === 'update') {
        this.main.updateService({data: this.serviceForm.getRawValue()}).subscribe((res: any) => {
          if (res.success) {
            this.main.snackbar(res.response, 'X', 2000, 'primary-panel');
            this.back();
          } else {
            this.main.snackbar('Updating Service Failed.', 'X', 2000, 'warn-panel');
          }
        })
      }
    } else {
      this.main.snackbar('Please conmplete the fields.', 'X', 2000, 'warn-panel');
    }
  }

  back(){
    this.router.navigate([this.main.getCurrentUserPrivileges() + '/services']);
  }

}
