const express = require("express");
const router = express.Router();
const ses = require("../models/session.model");

router.post("/session/add-session", (req, res) => {
    ses.addSession(req, res);
});

module.exports = router;
