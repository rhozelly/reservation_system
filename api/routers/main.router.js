const express = require("express");
const router = express.Router();
const main = require("../models/main.module");

/*----------------------------------
             Navs
-----------------------------------*/
router.get('/main/get-navs', (req, res) => {
    main.getNavs(req, res);
});
router.post('/main/get-navs-with-privs', (req, res) => {
    main.getNavsWithPrivs(req, res);
});

/*----------------------------------
             Discounts
-----------------------------------*/
router.post('/main/get-discounts', (req, res) => {
  main.getDiscounts(req, res);
});
router.post('/main/add-discount', (req, res) => {
  main.addDiscount(req, res);
});
router.post('/main/update-discount', (req, res) => {
  main.updateDiscount(req, res);
});
router.post('/main/delete-discount', (req, res) => {
  main.deleteDiscount(req, res);
});
router.post('/main/get-percent-discount', (req, res) => {
  main.getPercentDiscount(req, res);
});

/*----------------------------------
             Privileges
-----------------------------------*/
router.get('/main/get-privs', (req, res) =>{
  main.getPrivs(req, res);
});
router.post('/main/get-priv-of-the-account', (req, res) =>{
  main.getPrivOfTheAccount(req, res);
});
router.post('/main/update-privileges-settings', (req, res) =>{
  main.updatePrivilegesSettings(req, res);
});

/*----------------------------------
             Branches
-----------------------------------*/
router.get('/main/get-branches', (req, res) =>{
    main.getBranches(req, res);
});
router.post('/main/add-branch', (req, res) =>{
  main.addBranch(req, res);
});
router.post('/main/update-branch', (req, res) =>{
  main.updateBranch(req, res);
});
router.post('/main/delete-branch', (req, res) =>{
  main.deleteBranch(req, res);
});
/*----------------------------------
             Services
-----------------------------------*/
router.post('/main/get-services', (req, res) =>{
    main.getServices(req, res);
});
router.post('/main/get-services-by-branch-id', (req, res) =>{
    main.getServiceByBranchId(req, res);
});
router.post('/main/get-services-by-id', (req, res) =>{
  main.getServiceById(req, res);
});
router.get('/main/get-service-group', (req, res) =>{
    main.getServicesGroup(req, res);
});
router.post('/main/add-update-service-group', (req, res) =>{
    main.addandUpdateServicesGroup(req, res);
});
router.post('/main/delete-service-group', (req, res) =>{
    main.deleteServicesGroup(req, res);
});
router.post('/main/add-service', (req, res) =>{
    main.addService(req, res);
});
router.post('/main/update-service', (req, res) =>{
    main.updateService(req, res);
});
router.post('/main/update-service', (req, res) =>{
    main.updateService(req, res);
});
router.post('/main/delete-service', (req, res) =>{
    main.deleteService(req, res);
});
router.post('/main/get-available-services', (req, res) =>{
    main.getAvailableServicesInformation(req, res);
});
/*----------------------------------
             Rooms
-----------------------------------*/

router.post('/main/get-rooms', (req, res) =>{
  main.getRooms(req, res);
});
router.post('/main/get-room-by-room-id', (req, res) =>{
  main.getRoomByRoomId(req, res);
});
router.post('/main/add-rooms', (req, res) =>{
  main.addRoom(req, res);
});
router.post('/main/update-rooms', (req, res) =>{
  main.updateRoom(req, res);
});
router.post('/main/delete-rooms', (req, res) =>{
  main.deleteRoom(req, res);
});
router.post('/main/get-extra-time', (req, res) =>{
  main.getExtraTime(req, res);
});
router.get('/main/get-all-rooms', (req, res) =>{
  main.getAllRooms(req, res);
});
/*----------------------------------
             Rooms Categories
-----------------------------------*/

router.post('/main/get-rooms-category', (req, res) =>{
  main.getRoomsCategory(req, res);
});



module.exports = router;
