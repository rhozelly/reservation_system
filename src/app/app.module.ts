import { NgModule } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular'; // must go before plugins
import { BrowserModule } from '@angular/platform-browser';
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
// import interactionPlugin from '@fullcalendar/interaction'; 
FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  // interactionPlugin
]);
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from "@angular/common/http";
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from "@angular/flex-layout";
import { MaterialModule } from "./core/materials/material.module";
import { FormsModule } from "@angular/forms";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

//Components
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { BookingsComponent } from './components/bookings/bookings.component';
import { MembersComponent } from './components/members/members.component';
import { AddServiceComponent } from './components/services/add-service/add-service.component';
import { AddMemberComponent } from './components/members/add-member/add-member.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ServicesComponent } from './components/services/services.component';
import { RoomsComponent } from './components/rooms/rooms.component';
import { AddRoomComponent } from './components/rooms/add-room/add-room.component';
import { AvailabilityComponent } from './components/availability/availability.component';
import { DiscountsComponent } from './components/discounts/discounts.component';
import { CustomersComponent } from './customers/customers.component';
import { ClassificationComponent } from './components/classification/classification.component';

//Dailogs
import { AlertDialogComponent } from './dialogs/alert-dialog/alert-dialog.component';
import { AddBookingDialogComponent } from './dialogs/add-booking-dialog/add-booking-dialog.component';
import { SettingDialogComponent } from './dialogs/setting-dialog/setting-dialog.component';
import { AccountDialogComponent } from './dialogs/account-dialog/account-dialog.component';
import { TimeGridDialogComponent } from './dialogs/time-grid-dialog/time-grid-dialog.component';

//Services
import { AccountService } from "./core/services/account.service";
import { MainService } from './core/services/main.service';
import { MemberService } from './core/services/member.service';
import { BookingsService } from './core/services/bookings.service';
import { AddAdditionalGuestComponent } from './dialogs/add-additional-guest/add-additional-guest.component';
import { ReportComponent } from './components/report/report.component';
import { NgxPrintModule } from 'ngx-print';
import { TimeGridComponent } from './components/time-grid/time-grid.component';
import { CustomerService } from './core/services/customer.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    PageNotFoundComponent,
    CalendarComponent,
    BookingsComponent,
    MembersComponent,
    AddMemberComponent,
    AlertDialogComponent,
    AddBookingDialogComponent,
    ServicesComponent,
    RoomsComponent,
    AddServiceComponent,
    AddRoomComponent,
    AvailabilityComponent,
    DiscountsComponent,
    SettingDialogComponent,
    AccountDialogComponent,
    AddAdditionalGuestComponent,
    ReportComponent,
    TimeGridComponent,
    TimeGridDialogComponent,
    CustomersComponent,
    ClassificationComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FullCalendarModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    FormsModule,
    MaterialModule,
    FontAwesomeModule,
    NgxPrintModule
  ],
  providers: [
    AccountService,
    MainService,
    MemberService,
    BookingsService,
    CustomerService
  ],
  entryComponents: [
    AlertDialogComponent,
    AddBookingDialogComponent,
    SettingDialogComponent,
    AccountDialogComponent,    
    AddAdditionalGuestComponent,
    TimeGridDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
