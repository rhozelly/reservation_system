import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BookingsService {
  constructor(private http: HttpClient) { }

  getBookings(data: any) {
    return this.http.post(`/api/book/get-bookings`, data);
  }
  addBookingsInTimeGrid(data: any){
    return this.http.post(`/api/book/add-bookings-in-timegrid`, data);
  }
  addBooking(data: any) {
    return this.http.post(`/api/book/add-booking`, data);
  }
  
  updateBooking(data: any) {
    return this.http.post(`/api/book/update-booking`, data);
  }
  
  updateBookingByGuestId(data: any) {
    return this.http.post(`/api/book/update-booking-by-book-guest-id`, data);
  }
  
  updateBookingByGuestIdAndDate(data: any) {
    return this.http.post(`/api/book/update-booking-by-book-guest-id-and-date`, data);
  }
  updateMoreServiceBooking(data: any) {
    return this.http.post(`/api/book/update-more-service-booking`, data);
  }
  
  deleteBooking(data: any) {
    return this.http.post(`/api/book/delete-booking`, data);
  }  
  
  getTotalBookingsAsOfToday() {
    return this.http.get(`/api/book/get-total-bookin-as-of-today`);
  }
  
  getClientsBooking(data: any) {
    return this.http.post(`/api/book/get-client-booking`, data);
  }
  getClientsBookingAndDate(data: any) {
    return this.http.post(`/api/book/get-client-booking-and-date`, data);
  }

  removeAllServiceUpdateBooking(data: any) {
    return this.http.post(`/api/book/remove-all-service-booking`, data);
  }

  addGuestBooking(data: any) {
    return this.http.post(`/api/book/add-guest-booking`, data);
  }

  getLatestBookPaxId() {
    return this.http.get(`/api/book/get-latest-book-pax-id`);
  }  
  getAllClientsName() {
    return this.http.get(`/api/book/get-all-clients-name`);
  }
  addAdditionalBooking(data: any) {
    return this.http.post(`/api/book/add-aaditional-booking`, data);
  }
  calendarEventDisplay(data: any) {
    return this.http.post(`/api/book/calendar-event-display`, data);
  }
  getCurrentTimeBookings(data: any) {
    return this.http.post(`/api/book/get-current-time-booking`, data);
  }
  generateReports(data: any) {
    return this.http.post(`/api/book/generate-reports`, data);
  }
  getAllCounts() {
    return this.http.get(`/api/book/get-all-counts`);
  }
  
  getTherapistBookings(data: any) {
    return this.http.post(`/api/book/get-therapist-bookings`, data);
  }
  getClientsWithConcatBooking(data: any) {
    return this.http.post(`/api/book/get-client-with-concat-bookings`, data);
  }
  transferBooking(data: any) {
    return this.http.post(`/api/book/transfer-booking`, data);
  }
  getAvailableTherapistBookingsSchedules(data: any) {
    return this.http.post(`/api/book/get-available-therapist-booking-schedule`, data);
  }
  getMaxOfColumn(data: any) {
    return this.http.post(`/api/book/get-max-of-column`, data);
  }
  checkBookingByDateSelect(data: any) {
    return this.http.post(`/api/book/check-booking-by-date-selected`, data);
  }
}
