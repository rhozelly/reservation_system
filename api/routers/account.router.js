const express = require("express");
const router = express.Router();
const acc = require("../models/account.model");

router.post("/account/get-accounts", (req, res) => {
  acc.getAccounts(req, res);
});

router.post("/account/get-the-account", (req, res) => {
  acc.getTheAccount(req, res);
});

router.post("/account/get-account-and-profile", (req, res) => {
  acc.getAccountAndProfile(req, res);
});

router.post("/account/add-account-and-profile", (req, res) => {
  acc.addAccountAndProfile(req, res);
});

router.post("/account/update-account", (req, res) => {
  acc.updateAccount(req, res);
});

router.post("/account/update-profile", (req, res) => {
  acc.updateProfile(req, res);
});

router.post("/account/delete-account-and-profile", (req, res) => {
  acc.deleteAccounts(req, res);
});

router.post("/account/login", (req, res) => {
  acc.matchUsernameAndPassword(req, res);
});

module.exports = router;
