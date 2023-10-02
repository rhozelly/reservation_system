import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


// Components
import { LoginComponent } from "./components/login/login.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { BookingsComponent } from './components/bookings/bookings.component';
import { MembersComponent } from './components/members/members.component';
import { AddMemberComponent } from './components/members/add-member/add-member.component';
import { ServicesComponent } from './components/services/services.component';
import { RoomsComponent } from './components/rooms/rooms.component';
import { AddServiceComponent } from './components/services/add-service/add-service.component';
import { AddRoomComponent } from "./components/rooms/add-room/add-room.component";
import { AvailabilityComponent } from "./components/availability/availability.component";
import { DiscountsComponent } from './components/discounts/discounts.component';
import { TimeGridComponent } from './components/time-grid/time-grid.component';

// Guards
import { SuperAdminGuard } from './core/guards/super-admin.guard';
import { AdminGuard } from './core/guards/admin.guard';
import { ReportComponent } from './components/report/report.component';
import { CustomersComponent } from './customers/customers.component';
import { ClassificationComponent } from './components/classification/classification.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'super-admin',
    canActivate: [SuperAdminGuard],
    children: [
      {
        path: '',
        canActivateChild: [SuperAdminGuard],
        children: [
          {path: '', redirectTo: 'super-admin/dashboard', pathMatch: 'full'},
          {path: 'dashboard', component: DashboardComponent},
          {path: 'therapist', component: MembersComponent},
          {path: 'bookings', component: BookingsComponent},
          {path: 'calendar', component: CalendarComponent},
          {path: 'add-therapist', component: AddMemberComponent},
          {path: 'update-therapist', component: AddMemberComponent},
          {path: 'services', component: ServicesComponent},
          {path: 'add-service', component: AddServiceComponent},
          {path: 'update-service', component: AddServiceComponent},
          {path: 'rooms', component: RoomsComponent},
          {path: 'add-room', component: AddRoomComponent},
          {path: 'update-room', component: AddRoomComponent},
          {path: 'availability', component: AvailabilityComponent},
          {path: 'report', component: ReportComponent},
          {path: 'discounts', component: DiscountsComponent},
          {path: 'classification', component: ClassificationComponent},
          {path: '**', component: PageNotFoundComponent}
        ]
      }
    ]
  },
  {
    path: 'admin',
    canActivate: [AdminGuard],
    children: [
      {
        path: '',
        canActivateChild: [AdminGuard],
        children: [
          {path: '', redirectTo: 'admin/dashboard', pathMatch: 'full'},
          {path: 'dashboard', component: DashboardComponent},
          {path: 'therapist', component: MembersComponent},
          {path: 'bookings', component: BookingsComponent},
          {path: 'calendar', component: CalendarComponent},
          {path: 'add-therapist', component: AddMemberComponent},
          {path: 'update-therapist', component: AddMemberComponent},
          {path: 'services', component: ServicesComponent},
          {path: 'add-service', component: AddServiceComponent},
          {path: 'update-service', component: AddServiceComponent},
          {path: 'rooms', component: RoomsComponent},
          {path: 'add-room', component: AddRoomComponent},
          {path: 'update-room', component: AddRoomComponent},
          {path: 'availability', component: AvailabilityComponent},
          {path: 'discounts', component: DiscountsComponent},
          {path: 'report', component: ReportComponent},
          {path: 'time-grid', component: TimeGridComponent},
          {path: 'customer', component: CustomersComponent},
          {path: 'classification', component: ClassificationComponent},
          {path: '**', component: PageNotFoundComponent},
        ]
      }
    ]
  },
  {path: 'page-not-found', component: PageNotFoundComponent},
  {path: '**', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
