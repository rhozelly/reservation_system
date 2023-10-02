import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { MatSnackBar } from '@angular/material/snack-bar';
// import * as bcryptjs from 'bcryptjs';
import * as CryptoJS from 'crypto-js'

@Injectable({
  providedIn: 'root'
})
export class MainService {
  // salt = bcryptjs.genSaltSync(10);

  constructor(private http: HttpClient,
              private sb: MatSnackBar) { }

/*----------------------------------
        Dialog Material
-----------------------------------*/
  snackbar(message: string, action: string, duration: number, classname: string) {
    this.sb.open(message, action, {
      duration: duration,
      panelClass: [classname || 'primary-panel']
    });
  }

/*----------------------------------
          Session Tokens
-----------------------------------*/
  getSessionTokens(){
    return !!localStorage.getItem('sessions');
  }
  addSession(data: any){
    return this.http.post(`/api/session/add-session`, data);
  }
  tokenKeys(){
    const data: any = {
      session: 'S3sS!0/\/',
      session_data: 'S3sS!0/\/D@-\-@'
    }
    return data;
  }
  getCurrentUserPrivileges() {    
    const session_data_decrypted = this.decrypt(localStorage.getItem('sessions'),this.tokenKeys().session_data);
    const session_data_parsed = session_data_decrypted ? JSON.parse(session_data_decrypted) : [];
    return session_data_parsed.priv_label || null;
  }

  getCurrentUserAccId() {
    const session_data_decrypted = this.decrypt(localStorage.getItem('sessions'),this.tokenKeys().session_data);
    const session_data_parsed = session_data_decrypted ? JSON.parse(session_data_decrypted) : [];
    return session_data_parsed.acc_id || null;
  }

  getCurrentUserBranch() {
    const session_data_decrypted = this.decrypt(localStorage.getItem('sessions'),this.tokenKeys().session_data);
    const session_data_parsed = session_data_decrypted ? JSON.parse(session_data_decrypted) : [];
    return session_data_parsed.branch_id || null;
  }

/*----------------------------------
          Encryptions
-----------------------------------*/
  encrypt(value: any, key: any) {
    return CryptoJS.AES.encrypt(value.trim(), key.trim()).toString();
  }

  decrypt(value: any, key: any) {
    const val = value ? value : '';
    const ke = key ? key : '';
    return CryptoJS.AES.decrypt(val.trim(), ke.trim()).toString(CryptoJS.enc.Utf8);
  }


/*----------------------------------
          Navs
-----------------------------------*/
  getNavs(){
    return this.http.get(`/api/main/get-navs`);
  }
  getNavsWithPrivs(data: any){
    return this.http.post(`/api/main/get-navs-with-privs`, data);
  }




/*----------------------------------
          Discounts
-----------------------------------*/
getDiscounts(data: any){
  return this.http.post(`/api/main/get-discounts`, data);
}
addDiscount(data: any){
  return this.http.post(`/api/main/add-discount`, data);
}
updateDiscount(data: any){
  return this.http.post(`/api/main/update-discount`, data);
}
deleteDiscount(data: any){
  return this.http.post(`/api/main/delete-discount`, data);
}
getPercentDiscount(data: any){
  return this.http.post(`/api/main/get-percent-discount`, data);
}
/*----------------------------------
             Privileges
-----------------------------------*/
  getPrivs(){
    return this.http.get(`/api/main/get-privs`);
  }
  getPrivOfTheAccount(data: any){
    return this.http.post(`/api/main/get-priv-of-the-account`, data);
  }  
  updatePrivilegesSettings(data: any){
    return this.http.post(`/api/main/update-privileges-settings`, data);
  }  

/*----------------------------------
          Branches
-----------------------------------*/
  getBranches(){
    return this.http.get(`/api/main/get-branches`);
  }
  addBranch(data: any){
    return this.http.post(`/api/main/add-branch`, data);
  }
  updateBranch(data: any){
    return this.http.post(`/api/main/update-branch`, data);
  }
  deleteBranch(data: any){
    return this.http.post(`/api/main/delete-branch`, data);
  }

/*----------------------------------
          Services
-----------------------------------*/

  getServices(data: any){
    return this.http.post(`/api/main/get-services`, data);
  }
  getServiceByBranchId(data: any){
    return this.http.post(`/api/main/get-services-by-branch-id`, data);
  }
  getServiceById(data: any){
    return this.http.post(`/api/main/get-services-by-id`, data);
  }
  addService(data: any){
    return this.http.post(`/api/main/add-service`, data);
  }
  updateService(data: any){
    return this.http.post(`/api/main/update-service`, data);
  }
  deleteService(data: any){
    return this.http.post(`/api/main/delete-service`, data);
  }
  getServicesGroup(){
    return this.http.get(`/api/main/get-service-group`);
  }
  deleteServiceGroup(data: any){
    return this.http.post(`/api/main/delete-service-group`, data);
  }
  addUpdateServiceGroup(data: any){
    return this.http.post(`/api/main/add-update-service-group`, data);
  }
  getAvailableServicesInformation(data: any){
    return this.http.post(`/api/main/get-available-services`, data);
  }

  /*----------------------------------
          Rooms
-----------------------------------*/

  getRooms(data: any){
    return this.http.post(`/api/main/get-rooms`, data);
  }
  getAllRooms(){
    return this.http.get(`/api/main/get-all-rooms`);
  }
  getRoomByRoomId(data: any){
    return this.http.post(`/api/main/get-room-by-room-id`, data);
  }
  addRoom(data: any){
    return this.http.post(`/api/main/add-rooms`, data);
  }
  updateRoom(data: any){
    return this.http.post(`/api/main/update-rooms`, data);
  }
  deleteRoom(data: any){
    return this.http.post(`/api/main/delete-rooms`, data);
  }
  
/*----------------------------------
             Rooms Categories
-----------------------------------*/

getRoomsCategory(){
  return this.http.get(`/api/main/get-rooms-category`);
}


 /*----------------------------------
          Time Convertion
-----------------------------------*/
  
getExtraTime(data: any){
    return this.http.post(`/api/main/get-extra-time`, data);
  }

   /*----------------------------------
          Time Convertion
-----------------------------------*/

  convertTime12To24(time: any) {
    let hours   = Number(time.match(/^(\d+)/)[1]);
    const minutes = Number(time.match(/:(\d+)/)[1]);
    const AMPM    = time.match(/\s(.*)$/)[1];
    if (AMPM === "PM" && hours < 12) hours = hours + 12;
    if (AMPM === "AM" && hours === 12) hours = hours - 12;
    let sHours   = hours.toString();
    let sMinutes = minutes.toString();
    if (hours < 10) sHours = "0" + sHours;
    if (minutes < 10) sMinutes = "0" + sMinutes;
    return (sHours + ":" + sMinutes);
  }

  convertTime24to12(time: any) {
    time = time.toString().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
    if (time.length > 1) {
      time = time.slice (1);
      time[3] = +time[0] < 12 ? ' AM' : ' PM';
      time[0] = +time[0] % 12 || 12;
    }
    return time.join ('');
  }

}
