const express = require("express");
const router = express.Router();
const mem = require("../models/member.model");

router.post('/member/get-members', (req, res) => {
    mem.getMembers(req, res);
});
router.post('/member/get-member-by-id', (req, res) => {
  mem.getMembersById(req, res);
});
router.post('/member/get-members-by-branch', (req, res) => {
    mem.getMembersByBranch(req, res);
});
router.post('/member/add-members', (req, res) => {
    mem.addMember(req, res);
});
router.post('/member/update-members', (req, res) => {
    mem.updateMember(req, res);
});
router.post('/member/delete-members', (req, res) => {
    mem.deleteMember(req, res);
});
router.post('/member/add-member-to-order', (req, res) => {
  mem.addMemberToOrder(req, res);
});
router.post('/member/get-avail-by-branch', (req, res) => {
  mem.getAvailabilityByBranch(req, res);
});
router.post('/member/get-avail-by-branch-for-dashboard', (req, res) => {
  mem.getAvailabilityByBranchForDashboard(req, res);
});
router.post('/member/get-avail-by-branch-and-date', (req, res) => {
  mem.getAvailabilityByBranchAndDate(req, res);
});
router.post('/member/reorder-avail-members', (req, res) => {
  mem.reorderAvailMembers(req, res);
});
router.get('/member/truncate-avail', (req, res) => {
  mem.truncateAvailabilities(req, res);
});
router.post('/member/update-total-member-services', (req, res) => {
  mem.updateTotalMemberServices(req, res);
});
router.post('/member/get-available-therapist-on-the-date', (req, res) => {
  mem.getAvailableTherapistOnTheDate(req, res);
});
router.post('/member/update-member-restriction', (req, res) => {
  mem.updateMemberRestriction(req, res);
});
router.post('/member/add-member-to-order-in-logs', (req, res) => {
  mem.addMemberToOrderInLogs(req, res);
});
router.post('/member/get-TBA', (req, res) => {
  mem.getTBA(req, res);
});
router.post('/member/check-member-availability-yesterday', (req, res) => {
  mem.checkMemberAvailabilityYesterday(req, res);
});









module.exports = router;
