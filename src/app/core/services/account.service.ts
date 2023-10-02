import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http: HttpClient) { }

  sample() {
   
    return this.http.get(`http://localhost:4000/`);
  }
  getAccounts(data: any) {
    return this.http.post(`/api/account/get-accounts`, data);
  }

  getTheAccount(data: any) {
    return this.http.post(`/api/account/get-the-account`, data);
  }

  getAccountAndProfile(data: any) {
    return this.http.post(`/api/account/get-account-and-profile`, data);
  }

  addAccountAndProfile(data: any) {
    return this.http.post(`/api/account/add-account-and-profile`, data);
  } 

  updateAccount(data: any) {
    return this.http.post(`/api/account/update-account`, data);
  }

  updateProfile(data: any) {
    return this.http.post(`/api/account/update-profile`, data);
  }

  deleteAccounts(data: any) {
    return this.http.post(`/api/account/delete-account-and-profile`, data);
  }

  matchUsernameAndPassword(data: any) {
    return this.http.post(`/api/account/login`, data);
  }

}
