const express = require("express");
const router = express.Router();
const cus = require("../models/customer.model");

router.post("/customer/search-customers", (req, res) => {
    cus.searchCustomer(req, res);
});
router.post("/customer/search-category", (req, res) => {
    cus.searchCustomerCategory(req, res);
});
router.get("/customer/get-customers", (req, res) => {
    cus.getCustomers(req, res);
});

router.post("/customer/add-customer", (req, res) => {
    cus.addCustomer(req, res);
});
router.post("/customer/update-customer", (req, res) => {
    cus.updateCustomer(req, res);
});
router.get("/customer/get-customer-categories", (req, res) => {
    cus.getCustomersCategories(req, res);
});
router.post("/customer/add-customer-categories", (req, res) => {
    cus.addCustomerCategories(req, res);
});
router.post("/customer/update-customer-categories", (req, res) => {
    cus.updateCustomerCategories(req, res);
});
router.post("/customer/remove-customer-categories", (req, res) => {
    cus.removeCustomerCategories(req, res);
});


module.exports = router;
