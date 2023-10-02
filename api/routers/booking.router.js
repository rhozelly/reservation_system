const express = require("express");
const router = express.Router();
const book = require("../models/booking.model");

router.post("/book/get-bookings", (req, res) => {
  book.getBookings(req, res);
});
router.post("/book/add-bookings-in-timegrid", (req, res) => {
  book.addBookingsInTimeGrid(req, res);
});
router.post("/book/add-booking", (req, res) => {
  book.addBooking(req, res);
});
router.post("/book/update-booking", (req, res) => {
  book.updateBooking(req, res);
});
router.post("/book/update-booking-by-book-guest-id", (req, res) => {
  book.updateBookingByGuestId(req, res);
});
router.post("/book/update-booking-by-book-guest-id-and-date", (req, res) => {
  book.updateBookingByGuestIdAndDate(req, res);
});
router.post("/book/update-more-service-booking", (req, res) => {
  book.updateMoreServiceBooking(req, res);
});
router.post("/book/delete-booking", (req, res) => {
  book.deleteBooking(req, res);
});
router.get("/book/get-total-bookin-as-of-today", (req, res) => {
  book.getTotalBookingsAsOfToday(req, res);
});
router.post("/book/get-client-booking", (req, res) => {
  book.getClientsBooking(req, res);
});
router.post("/book/get-client-booking-and-date", (req, res) => {
  book.getClientsBookingAndDate(req, res);
});
router.post("/book/remove-all-service-booking", (req, res) => {
  book.removeAllServiceUpdateBooking(req, res);
});
router.post("/book/add-guest-booking", (req, res) => {
  book.addGuestBooking(req, res);
});
router.get("/book/get-latest-book-pax-id", (req, res) => {
  book.getLatestBookPaxId(req, res);
});
router.get("/book/get-all-clients-name", (req, res) => {
  book.getAllClientsName(req, res);
});
router.post("/book/add-aaditional-booking", (req, res) => {
  book.addAdditionalBooking(req, res);
});
router.post("/book/calendar-event-display", (req, res) => {
  book.calendarEventDisplay(req, res);
});
router.post("/book/get-current-time-booking", (req, res) => {
  book.getCurrentTimeBookings(req, res);
});
router.post("/book/generate-reports", (req, res) => {
  book.generateReports(req, res);
});
router.get("/book/get-all-counts", (req, res) => {
  book.getAllCounts(req, res);
});
router.post("/book/get-therapist-bookings", (req, res) => {
  book.getTherapistBookings(req, res);
});
router.post("/book/get-client-with-concat-bookings", (req, res) => {
  book.getClientsWithConcatBooking(req, res);
});
router.post("/book/transfer-booking", (req, res) => {
  book.transferBooking(req, res);
});
router.post("/book/get-available-therapist-booking-schedule", (req, res) => {
  book.getAvailableTherapistBookingsSchedules(req, res);
});
router.post("/book/get-max-of-column", (req, res) => {
  book.getMaxOfColumn(req, res);
});
router.post("/book/check-booking-by-date-selected", (req, res) => {
  book.checkBookingByDateSelect(req, res);
});








module.exports = router;
