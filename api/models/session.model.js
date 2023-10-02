const pool = require("../utils/mysql-connection");
const fs = require("fs");
const async = require("async");
const bcrypt = require('bcrypt');

let em = {message: 'Please try again later', code: 503, status: 'Empty Response'};

const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'super_admin ';


function AddSession(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }
    let data = req.body.data || '';
    let addsessionsquery = `INSERT INTO tbl_sessions SET ?`;
    conn.query(addsessionsquery, [data], (error, results) => {
      conn.release();
      if (error) {
        res.json({em});
      } else {
        res.json({success: true, response: 'Session Successfully Added'});
      }
    });
  });
}


module.exports = {
    addSession: AddSession,
}
