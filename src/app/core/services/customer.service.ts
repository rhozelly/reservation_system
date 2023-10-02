
import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

 
  constructor(private http: HttpClient) { }

  searchCustomers(data: any) {
    return this.http.post(`/api/customer/search-customers`, data);
  }

  searchCustomerCategory(data: any) {
    return this.http.post(`/api/customer/search-category`, data);
  }

  getCustomers() {
    return this.http.get(`/api/customer/get-customers`);
  }

  addCustomer(data: any) {
      return this.http.post(`/api/customer/add-customer`, data);
  }

  updateCustomer(data: any) {
      return this.http.post(`/api/customer/update-customer`, data);
  }

  getCustomersCategories(){
     return this.http.get(`/api/customer/get-customer-categories`);
  }
  addCustomerCategories(data: any){
    return this.http.post(`/api/customer/add-customer-categories`, data);
 }
  updateCustomerCategories(data: any){
    return this.http.post(`/api/customer/update-customer-categories`, data);
 }
 removeCustomerCategories(data: any){
    return this.http.post(`/api/customer/remove-customer-categories`, data);
 }
}
