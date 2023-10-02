import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  constructor(private http: HttpClient) { }

  getMembers(data: any){
    return this.http.post('api/member/get-members', data);
  }
  getMemberById(data: any){
    return this.http.post('api/member/get-member-by-id', data);
  }
  getMembersByBranch(data: any){
    return this.http.post('api/member/get-members-by-branch', data);
  }
  addMembers(data: any){
    return this.http.post('api/member/add-members', data);
  }
  updateMembers(data: any){
    return this.http.post('api/member/update-members', data);
  }
  deleteMembers(data: any){
    return this.http.post('api/member/delete-members', data);
  }
  addMemberToOrder(data: any){
    return this.http.post('api/member/add-member-to-order', data);
  }
  getAvailabilityByBranch(data: any){
    return this.http.post('api/member/get-avail-by-branch', data);
  }
  getAvailabilityByBranchForDashboard(data: any){
    return this.http.post('api/member/get-avail-by-branch-for-dashboard', data);
  }
  getAvailabilityByBranchAndDate(data: any){
    return this.http.post('api/member/get-avail-by-branch-and-date', data);
  }
  reorderAvailMembers(data: any){
    return this.http.post('api/member/reorder-avail-members', data);
  }
  truncateAvailabilities(){
    return this.http.get('api/member/truncate-avail');
  }
  updateTotalMemberServices(data: any){
    return this.http.post('api/member/update-total-member-services', data);
  }
  getAvailableTherapistOnTheDate(data: any){
    return this.http.post('api/member/get-available-therapist-on-the-date', data);
  }
  updateMemberRestriction(data: any){
    return this.http.post('api/member/update-member-restriction', data);
  }
  addMemberToOrderInLogs(data: any){
    return this.http.post('api/member/add-member-to-order-in-logs', data);
  }
  getTBA(data: any){
    return this.http.post('api/member/get-TBA', data);
  }
  checkMemberAvailabilityYesterday(data: any){
    return this.http.post('api/member/check-member-availability-yesterday', data);
  }
  
  


}
