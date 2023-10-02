const pool = require("../utils/mysql-connection");
const fs = require("fs");
const async = require("async");
const bcrypt = require('bcrypt');

// const CryptoJS = require("crypto-js");
let em = {message: 'Please try again later', code: 503, status: 'Empty Response'};

const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'super_admin ';


function GetAccounts(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }
    let data = req.body.data;

    let getAccountsQuery = `SELECT * FROM tbl_accounts`;
    conn.query(getAccountsQuery, (error, results) => {
      conn.release();
      if (error) {
        res.json({em});
      } else {
        res.json({success: true, response: results});
      }
    });
  });
}


function GetTheAccount(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }
    let data = req.body.data || '';

    let gettheaccountquery = `SELECT * FROM tbl_accounts a JOIN
        tbl_profiles b ON a.acc_id = b.acc_id WHERE b.acc_id = ?`;
    conn.query(gettheaccountquery,[data], (error, results) => {
      conn.release();
      if (error) {
        res.json({em});
      } else {
        res.json({success: true, response: results[0]});
      }
    });
  });
}

function AddAccountAndProfile(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }
    let data = req.body.data || '';
    let addaccountquery = `INSERT INTO tbl_accounts SET ?;
                           INSERT INTO tbl_profiles (acc_id, prof_name)
                           VALUES(LAST_INSERT_ID(), ?)`;
    async.waterfall([
          addAccountToTables,
          getNavs,
          splitPrivilegesDatas,
          addAccountPrivileges,
    ], function (err, result) {
      conn.release();
      if (err) {
        res.json(em);
      } else {
        if(result.success){
          res.json({success: result.success, response: 'An account was added successfully!'})
        }
      }
    });
        

    function addAccountToTables(callback){
      bcrypt.hash(data.acc_pass, saltRounds, function(err, hash) {
        const a = {
          acc_uname: data.acc_uname,
          acc_pass: hash,
          priv_id: data.priv_id,
          branch_id: data.branch_id,
        }
        conn.query(addaccountquery, [a, data.prof_name], (error, results) => {
          if (error) {
            callback(null, {success: false});
          } else {
            callback(null, {success: true});
          }
        });
      });
    }

    function getNavs(result, callback){
      if(result.success){
          let getnavsquery = `SELECT * FROM inf_navs;
                              SELECT * FROM tbl_privileges WHERE priv_id = ?;
                              SELECT MAX(acc_id) as latest FROM tbl_accounts`;
          conn.query(getnavsquery,[data.priv_id], (error, results) => {
            if (error) {
              callback(null, {success: false});
            } else {
              callback(null, {success: true, result: results});
            }
          });
      }
    }
         
    function splitPrivilegesDatas(first_result, callback) { 
      let data_priv_setting  =[];
      let navs = first_result.result[0] ? first_result.result[0] : [];
      let privs = first_result.result[1] ? first_result.result[1] : [];
      let acc_id = first_result.result[2].length > 0 ? first_result.result[2][0]['latest'] : [];
      if(first_result.success){
        let priv_binary_array = privs[0] ? privs[0].priv_binary.split(',') : [];
        let priv_binary_false = getFalseBinaryInAnArray(priv_binary_array);
        navs.forEach((e, i) =>{
            data_priv_setting.push({
                priv_id: data.priv_id,
                nav_id: e.nav_id,
                sett_url: '/' + e.nav_name,
                view: 1,
                add: 1,
                update: 1,
                delete: 1,
                acc_id: acc_id
            });
        });        
        callback(null, {success: true, output: data_priv_setting, binary: priv_binary_false});
      } else {
        callback(null, {success: false});
      }
    }

    function addAccountPrivileges(second_result, callback){
      let second_query_result = [];
        if(second_result.success){
          let false_binary = second_result.binary.length > 0 ? second_result.binary : [];
          false_binary.forEach(e =>{
              second_result.output[e].view = 0;
              second_result.output[e].add = 0;
              second_result.output[e].update = 0;
              second_result.output[e].delete = 0;
          })
          let final_array = second_result.output;          
          let addprivsettingquery = `INSERT INTO tbl_privileges_setting SET ?`;
          final_array.forEach(e => {
              conn.query(addprivsettingquery, [e], (error, results) => {
                second_query_result.push(!error);
              });
          })
          callback(null, {success: second_query_result.length > 0 ? false : true});
        }
      }
  });
}
   
      
function getFalseBinaryInAnArray(array_priv){
  let false_array = [];
  array_priv.findIndex((element, index) => {
    if (element === '0') {
      false_array.push(index);
    }
  });
  return false_array;
}

      
function arrayData(a, b, data, c){
  let data_priv_setting = [];
    a.forEach(ar_el =>{
      if(ar_el === b){
        data_priv_setting.push({
          priv_id: data.priv_id,
          nav_id: b,
          sett_url: '/' + c,
          view: 0,
          add: 0,
          update: 0,
          delete: 0,
        })
      } else {
        data_priv_setting.push({
          priv_id: data.priv_id,
          nav_id: b,
          sett_url: '/' + c,
          view: 1,
          add: 1,
          update: 1,
          delete: 1,
        })
      }                  
    })    
  return data_priv_setting;
}



function GetAccountAndProfile(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }
    // let data = req.body.data || '';
    let size = req.body.size || 5;
    let index = req.body.index >= 0 ? req.body.index : 0;

    let gettheaccountquery = `SELECT * FROM tbl_accounts a
          JOIN tbl_profiles b ON a.acc_id = b.acc_id
          JOIN tbl_branch c ON a.branch_id = c.branch_id
          ORDER BY a.acc_id ASC
          LIMIT ${index}, ${size};
          SELECT COUNT(*) AS total_data FROM tbl_accounts a
          JOIN tbl_profiles b ON a.acc_id = b.acc_id
          JOIN tbl_branch c ON a.branch_id = c.branch_id`;
    conn.query(gettheaccountquery, (error, results) => {
      conn.release();
      if (error) {
        res.json({em});
      } else {
        res.json({success: true, response: results[0], total_data: results[1][0]});
      }
    });
  });
}


function UpdateAccount(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }
    let data = req.body.data || '';
    let id = req.body.id || '';
    if(data.acc_pass){
      bcrypt.hash(data.acc_pass, saltRounds, function(err, hash) {
        const account_data = {
          acc_uname: data.acc_uname,
          acc_pass: hash,
        }
        let updateaccountquery = `UPDATE tbl_accounts SET ? WHERE acc_id = ?`;
        conn.query(updateaccountquery,[account_data, id], (error, results) => {
          conn.release();
          if (error) {
            res.json({em});
          } else {
            res.json({success: true, response: 'Credentials was successfully updated!'});
          }
        });
      });
    } else {
      let updateaccountquery = `UPDATE tbl_accounts SET ? WHERE acc_id = ?`;
      conn.query(updateaccountquery,[data, id], (error, results) => {
        conn.release();
        if (error) {
          res.json({em});
        } else {
          res.json({success: true, response: 'Credentials was successfully updated!'});
        }
      });
    }
  });
}


function UpdateProfile(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }
    let data = req.body.data || '';
    let id = req.body.id || '';
    let updateprofilequery = `UPDATE tbl_profiles SET ? WHERE prof_id = ?`;
    conn.query(updateprofilequery,[data, id], (error, results) => {
      conn.release();
      if (error) {
        res.json({em});
      } else {
        res.json({success: true, response: 'Profile was successfully updated!'});
      }
    });
  });
}


function DeleteAccounts(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }
    let data = req.body.data || '';
    let deleteaccountquery = `DELETE FROM tbl_accounts WHERE acc_id = ?`;
    let deleteprofilequery = `DELETE FROM tbl_profiles WHERE prof_id = ?`;

    async.waterfall([
      removeProfile,
      removeAccount
    ], function (err, result) {
      conn.release();
      if (err) {
        res.json(em);
      } else {
        if(result.success){
          res.json({success: res.success, response: 'Account was removed successfully!'})
        }
      }
    });

    function removeProfile(callback) {
      conn.query(deleteprofilequery, [data.prof_id], (error, results) => {
        if (error) {
          callback(null, {success: false});
        } else {
          callback(null, {success: true});
        }
      });
    }
    function removeAccount(callback) {
      if(callback.success){
        conn.query(deleteaccountquery, [data.acc_id], (error, results) => {
          if (error) {
            callback(null, {success: false});
          } else {
            callback(null, {success: true});
          }
        });
      } else {
        callback(null, {success: false});
      }
    }
  });
}


function MatchUsernameAndPassword(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }
    let data = req.body.data || '';

    const checkusernamequery = `SELECT * FROM tbl_accounts WHERE acc_uname = ? AND deleted = 0`;
    const getprivilegesquery = `
          SELECT b.acc_id, b.acc_status, b.deleted, a.*, c.branch_id 
          FROM tbl_privileges a 
          JOIN tbl_accounts b ON b.priv_id = a.priv_id
          JOIN tbl_branch c ON b.branch_id = c.branch_id
          WHERE a.priv_id  = ? AND b.deleted = 0 AND b.acc_id = ?`;

    async.waterfall([
      checkUsername,
      checkPassword
    ], function (err, result) {
      conn.release();
      if (err) {
        res.json(em);
      } else {
        res.json(result)
      }
    });

    function checkUsername(callback) {
      conn.query(checkusernamequery, [data.uname], (error, results) => {
        if (error) {
          callback(null, false);
        } else {
          const data = results.length > 0 ? {success: true, data: results} : {success: false, data: null}
          callback(null, data);
        }
      });
    }

    function checkPassword(first_respond, callback) {
      if(first_respond.success){
        bcrypt.compare(data.pass, first_respond.data[0].acc_pass,  function(err, result) {
          if(result){
            conn.query(getprivilegesquery, [first_respond.data[0].priv_id, first_respond.data[0].acc_id], (error, results) => {
              if (error) {
                callback(null, {success: false, data: 'Error in Getting Privileges.'});
              } else {
                callback(null, {success: result, data: result ? results[0] : 'Invalid Password.'});
              }
            });
          }
        });
      } else {
        callback(null, {success: false, data: 'Invalid Username.'});
      }
    }
  });
}


module.exports = {
  getAccounts: GetAccounts,
  getTheAccount: GetTheAccount,
  getAccountAndProfile: GetAccountAndProfile,
  addAccountAndProfile: AddAccountAndProfile,
  updateAccount: UpdateAccount,
  updateProfile: UpdateProfile,
  matchUsernameAndPassword: MatchUsernameAndPassword,
  deleteAccounts: DeleteAccounts
};
