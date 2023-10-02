import { Component, DoCheck, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { Router, Event as NavigationEvent, NavigationEnd } from '@angular/router';
import { MainService } from './core/services/main.service';
import { SettingDialogComponent } from './dialogs/setting-dialog/setting-dialog.component';
import { AccountService } from './core/services/account.service';
import { AccountDialogComponent } from './dialogs/account-dialog/account-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements DoCheck, OnInit {
  
  dateNow: any = moment().format("dddd, MMMM DD, YYYY");
  timeNow: any = moment().format("hh:mm A");
  title = 'spa-app';
  sessions: any = localStorage.getItem('sessions');
  isLoggedIn: any;
  role: any;
  currentUrl: any = '';
  active_class: any = '';
  navs: any = [];
  account: any = [];
  valueEmittedLogged:any;
  constructor(
    private router: Router,
    private main: MainService,
    private dialog: MatDialog,
    private acc: AccountService
  ) {}

  parentEventHandlerFunction(valueEmitted: any){
    this.valueEmittedLogged = valueEmitted === "logged in";
    this.isLoggedIn = this.valueEmittedLogged;
    if(this.isLoggedIn){
      this.getNavs();
      this.role = this.main.getCurrentUserPrivileges() || [];
    }
  }

  ngOnInit() {    
    this.role = this.main.getCurrentUserPrivileges() || [];
    this.isLoggedIn = this.sessions !== null;
    
    this.router.events.subscribe((event: NavigationEvent) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;      
            
        if(this.currentUrl === "/login" && localStorage.getItem('sessions')?.length === undefined){
          this.isLoggedIn = localStorage.getItem('sessions') !== null;
          this.router.navigate(['/login']);
        }

        if(this.currentUrl === "/" && this.role){
          this.router.navigate([this.role + '/bookings']);          
        }
      }
    });

    if(this.isLoggedIn){
      this.getNavs();
      this.getAccount();
    }
  }

  getNavs(){
    this.active_class = 'active-list-item';
    this.main.getNavsWithPrivs({data: this.main.getCurrentUserAccId()}).subscribe((res: any) =>{
      if(res.success){
        this.navs = res.response || [];        
      }
    })
  }

  getAccount(){
    this.acc.getTheAccount({data: this.main.getCurrentUserAccId()}).subscribe((res: any) =>{
        this.account = res.success ? res.response : [];
    });
  }

  settings(){
    const dialogRef = this.dialog.open(SettingDialogComponent, { width: '980px', height: 'auto', disableClose: true});
          dialogRef.afterClosed().subscribe(result => {
    });
  }

  accounts(a: any){
    const dialogRef = this.dialog.open(AccountDialogComponent, { width: '450px' });
          dialogRef.afterClosed().subscribe(result => {
    });
  }

  ngOnDestroy() {}

  ngDoCheck(): void {}

  logout(){
    localStorage.clear();
    this.router.navigate(['/login']);
  }

}
