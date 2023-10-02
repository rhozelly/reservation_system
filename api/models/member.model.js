const pool = require("../utils/mysql-connection");
const fs = require("fs");
const async = require("async");
let em = {message: 'Please try again later', code: 503, status: 'Empty Response', success: false};
const moment = require('moment');  

function GetMembers(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }
    let data = req.body.data || '';
    let size = req.body.size || 10;
    let search = req.body.search || "";
    let index = req.body.index >= 0 ? req.body.index : 0;
    let getmembersquery;
    if(search){
      getmembersquery = `
      SELECT * FROM tbl_members a
      JOIN tbl_branch b ON a.branch_id = b.branch_id 
        WHERE a.mem_name
        LIKE '%${search}%' OR
        b.branch_name LIKE '%${search}%' OR
        b.branch_address LIKE '%${search}%' OR
        a.mem_status LIKE '%${search}%'
        ORDER BY a.mem_name ASC
        LIMIT ${size};
        SELECT COUNT(*) AS total_data FROM tbl_members;
      `;
    } else {
      getmembersquery = `
        SELECT * FROM tbl_members a
        JOIN tbl_branch b ON a.branch_id = b.branch_id 
        ORDER BY a.mem_name ASC
        LIMIT ${index}, ${size};
        SELECT COUNT(*) AS total_data FROM tbl_members;
      `;
    }
    conn.query(getmembersquery, (error, results) => {
      conn.release();
      if (error) {
        res.json({em});
      } else {
        if(results.length > 0){
          res.json({success: true, response: results[0], length: results[1][0].total_data});
        } else {
          res.json({success: true, response: [], length: 0});
        }
      }
    });
  });
}

function GetMembersByBranch(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }
    let id = req.body.data || '';
    let getmemberbybranchquery = `SELECT * FROM tbl_members WHERE branch_id = ?`;
    conn.query(getmemberbybranchquery, [id], (error, results) => {
      conn.release();
      if (error) {
        res.json({em});
      } else {
        res.json({success: true, response: results});
      }
    });
  });
}

function GetMembersById(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }
    let id = req.body.data || '';
    let getmemberbybranchquery = `SELECT * FROM tbl_members WHERE mem_id = ?`;
    conn.query(getmemberbybranchquery, [id], (error, results) => {
      conn.release();
      if (error) {
        res.json({em});
      } else {
        res.json({success: true, response: results});
      }
    });
  });
}

function AddMember(req, res) {
    pool.getConnection((error, conn) => {
      if (error) {
        if (conn) conn.release();
        res.json({code: 100, status: "Error in connecting to the database"});
        return;
      }
      let data = req.body.data || '';
      let addmemberquery = `INSERT INTO tbl_members SET ?`;
      conn.query(addmemberquery, [data], (error, results) => {
        conn.release();
        if (error) {
          res.json({em});
        } else {
          res.json({success: true, response: 'Member Successfully Added'});
        }
      });
    });
  }


function UpdateMember(req, res) {
    pool.getConnection((error, conn) => {
      if (error) {
        if (conn) conn.release();
        res.json({code: 100, status: "Error in connecting to the database"});
        return;
      }
      let data = req.body.data || '';
      let id = req.body.id || '';
      data.mem_in = data.mem_in ? 'true' : 'false';
      let updatememberquery = `UPDATE tbl_members SET ? WHERE mem_id = ?`;
      conn.query(updatememberquery, [data, id], (error, results) => {
        conn.release();
        if (error) {
          res.json({em});
        } else {
          res.json({success: true, response: 'Member Successfully Updated'});
        }
      });
    });
  }

  function UpdateMemberRestriction(req, res) {
      pool.getConnection((error, conn) => {
        if (error) {
          if (conn) conn.release();
          res.json({code: 100, status: "Error in connecting to the database"});
          return;
        }
        let data = req.body.data;
        let id = req.body.id || '';
        let updatememberrestrictionquery = `UPDATE tbl_members SET mem_restricted = ? WHERE mem_id = ?`;
        conn.query(updatememberrestrictionquery, [data, id], (error, results) => {
          conn.release();
          if (error) {
            res.json({em});
          } else {
            res.json({success: true, response: 'Therapist is Successfully Restricted'});
          }
        });
      });
  }

  function DeleteMember(req, res) {
      pool.getConnection((error, conn) => {
        if (error) {
          if (conn) conn.release();
          res.json({code: 100, status: "Error in connecting to the database"});
          return;
        }
        let data = req.body.data || '';
        let deletememberquery = `DELETE FROM tbl_members WHERE mem_id = ?`;
        conn.query(deletememberquery, [data], (error, results) => {
          conn.release();
          if (error) {
            res.json({em});
          } else {
            res.json({success: true, response: 'Member Successfully Deleted'});
          }
        });
      });
  }

  function AddMemberToOrder(req, res) {
    pool.getConnection((error, conn) => {
      if (error) {
        if (conn) conn.release();
        res.json({code: 100, status: "Error in connecting to the database"});
        return;
      }
      let data = req.body.data || '';
      let checked = req.body.checked || '';
      // let checkmemberifexistquery = `SELECT * FROM tbl_avail_member WHERE mem_id = ? AND branch_id = ?`;
      let addmembertoorderquery = `INSERT INTO tbl_avail_member SET ?`;
      let deleteexistingmemberquery = `DELETE FROM tbl_avail_member WHERE mem_id = ? AND branch_id = ?`;
      let getlatestorderquery = `SELECT * FROM tbl_avail_member WHERE avail_mem_order=(SELECT max(avail_mem_order) FROM tbl_avail_member) AND branch_id = ?`;

      async.waterfall([
        checkActionToggled,
        checkMemberIfExistOnTheAvailTable,
      ], function (err, result) {
        conn.release();
        if (err) {
          res.json(em);
        } else {
          res.json({success: true, response: result});
        }
      });

      function checkActionToggled(callback){
        if(checked){
          conn.query(getlatestorderquery, [data.branch_id], (error, results) => {
            if (error) {
              callback(null, {success: false});
            } else {
              callback(null, {success: true, response: results});
            }
          });
        } else {
          conn.query(deleteexistingmemberquery, [data.mem_id, data.branch_id], (error, results) => {
            if (error) {
              callback(null, {success: false});
            } else {
              callback(null, {success: true, response: 'Successfully Removed to Order'});
            }
          });
        }
      }

      function checkMemberIfExistOnTheAvailTable(result_toggled, callback) {
        if(result_toggled.success){
          const latest_order = result_toggled.response.length > 0 ? result_toggled.response[0].avail_mem_order + 1 : 1;
          const toAddData = {
            mem_id: data.mem_id,
            branch_id: data.branch_id,
            avail_mem_order: latest_order
          }
          conn.query(addmembertoorderquery, [toAddData], (error, results) => {
            if (error) {
              callback(null, {success: false});
            } else {
              const x = checked ? 'Added to Order.' : 'Removed from Order.';
              callback(null, {success: true, response:`Successfully ${x}`});
            }
          });
        } else {
          callback(null, {success: false,  response:'Adding to Order Failed'});
        }
      }  
    });
  }

  function GetAvailabilityByBranch(req, res) {
    pool.getConnection((error, conn) => {
      if (error) {
        if (conn) conn.release();
        res.json({code: 100, status: "Error in connecting to the database"});
        return;
      }

      let data = req.body.data || '';
      const today = moment().format('YYYY-MM-DD');
      let getavailabilityquery = `SELECT * FROM tbl_avail_member a JOIN
           tbl_members b ON a.mem_id = b.mem_id WHERE a.branch_id = ? AND CAST(a.avail_mem_date AS DATE) = CAST('${today}' AS DATE) ORDER BY a.avail_mem_order ASC`;
      conn.query(getavailabilityquery, [data], (error, results) => {
        conn.release();
        if (error) {
          res.json({em});
        } else {
          res.json({success: true, response: results});
        }
      });
    });    
}

function GetAvailabilityByBranchForDashboard(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }

    let data = req.body.data || '';
    const today = moment().format('YYYY-MM-DD');
    let getavailabilityquery = `SELECT * FROM tbl_avail_member a LEFT JOIN
    tbl_members b ON a.mem_id = b.mem_id WHERE a.branch_id = ?
    AND b.mem_in = 'true' AND
    CAST(a.avail_mem_date AS DATE) = CAST('${today}' AS DATE)
    GROUP BY a.mem_id ORDER BY a.avail_mem_order ASC`;
    conn.query(getavailabilityquery, [data], (error, results) => {
      conn.release();
      if (error) {
        res.json({em});
      } else {
        res.json({success: true, response: results});
      }
    });
  });    
}

function GetAvailabilityByBranchAndDate(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }

    let data = req.body.data || '';
    let date = req.body.date || '';
    let table = req.body.table || 'tbl_avail_member';
    let getavailabilityquery = `SELECT * FROM ${table} a JOIN
         tbl_members b ON a.mem_id = b.mem_id WHERE a.branch_id = ? AND CAST(a.avail_mem_date AS DATE) = CAST('${date}' AS DATE) ORDER BY a.avail_mem_order ASC`;
    conn.query(getavailabilityquery, [data], (error, results) => {
      conn.release();
      if (error) {
        res.json({em});
      } else {
        res.json({success: true, response: results});
      }
    });
  });    
}

function ReorderAvailMembers(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }
    let data = req.body.data || '';
    let data_revised_pushed = [];
    let i = 1;

    async.waterfall([
      loopdatamembers,
      updatereorderdata,
    ], function (err, result) {
      conn.release();
      if (err) {
        res.json(em);
      } else {
        if(result.success){
          res.json({success: result.success, response: result.response});
        } else {
          res.json({success: false, response: 'Reordering Failed.'});
        }
      }
    });

    function loopdatamembers(callback){
      data.forEach((el) => {
        let data_revised = {
          avail_mem_order: i++,
          mem_id: el.mem_id,
          branch_id: el.branch_id
        }
        data_revised_pushed.push(data_revised);
      });
      callback(null, data_revised_pushed)
    }

    function updatereorderdata(data_callback, callback){
      data_callback.forEach(el => {
        let updatereorderavailmembersquery = `UPDATE tbl_avail_member SET ? WHERE  mem_id = ? AND branch_id = ?`;
        conn.query(updatereorderavailmembersquery, [el, el.mem_id, el.branch_id], (error, results) => {
          if (error) throw error;
          if (error) {
            callback(null, {success: false});
          } 
        });        
      });
      callback(null, {success: true, response: 'Reorder Successfully'});
    }
  });
}


function TruncateAvailabilities(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }

    async.waterfall([
      truncateAndUpdateTables,
      getRoomsStatus,
      updateRoomsStatus,
    ], function (err, result) {
      conn.release();
      if (err) {
        res.json(em);
      } else {
        if(result.success){
          res.json({success: true, response: 'Reset All Successfully'});
        } else {
          res.json({em});
        }
      }
    });

    function truncateAndUpdateTables(callback){
      let truncatetables = `TRUNCATE TABLE tbl_avail_member;
                            UPDATE tbl_members SET mem_in = 'false' WHERE mem_name <> 'TBA';
                            UPDATE inf_rooms SET room_status = 1;`; 
      conn.query(truncatetables, (error, results) => {
        if (error) {
          callback(null, {success: false})
        } else {
          callback(null, {success: true})
        }
      });

    }
    getRoomsStatus
    function getRoomsStatus(first_result, callback){
      if(first_result.success){
        let getroomsinfo = `SELECT * FROM inf_rooms`; 
        conn.query(getroomsinfo, (error, results) => {
            if (error) {
              callback(null, {success: false})
            } else {
              callback(null, {success: true, response: results})
            }
        });
      } else {        
        callback(null, {success: false})
      }
    }

    function updateRoomsStatus(second_result, callback){
        if(second_result.success){
            let query_result = false;
            let arr  = second_result.response.length > 0 ? second_result.response : [];
            arr.forEach(el =>{
              const pax = el.room_pax;
              const pax_array = el.room_pax_status ? el.room_pax_status.split(',') : [];
              const new_pax_array = reorganizeBinary(pax_array.length);
              const new_pax_array_join = new_pax_array.join(',')
              let updateroomstatuspaxquery = `UPDATE inf_rooms SET room_pax_status = ? WHERE room_id = ?`; 
                conn.query(updateroomstatuspaxquery,[new_pax_array_join, el.room_id], (error, results) => {
                  query_result = !error;
                });
            })
            setTimeout(t => {
              callback(null, {success: query_result})
            }, 1500)
        } else {
            callback(null, {success: false})
        }
      }
    });    
  }

  function reorganizeBinary(length){
    let output = [];
    for (let i = 0; i < length; i++) {
      output.push(1);
    }
    return output;
  }


  

function UpdateTotalMemberServices(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }
    let data = req.body.data || '';
    let id = req.body.id || '';
    let operator = req.body.operator || '+';

    async.waterfall([
      getTotalinMemberTable,
      updateTotalServices,
    ], function (err, result) {
      conn.release();
      if (err) {
        res.json(em);
      } else {
        if(result.success){
          res.json({success: true, response: 'Services Calculated Successfully'});
        } else {
          res.json({em});
        }
      }
    });

    function getTotalinMemberTable(callback){
      let getttoalinmemberquery = `
          SELECT mem_total_services as total FROM tbl_members WHERE mem_id = ?;
          SELECT service_total as total FROM tbl_avail_member WHERE mem_id = ?;
       `; 
      conn.query(getttoalinmemberquery,[id, id], (error, results) => {
        if (error) {
          callback(null, {success: false})
        } else {
          callback(null, {success: true, response: results})
        }
      });
    }

    function updateTotalServices(first_response, callback){
      if(first_response.success){
        let mem_table = first_response.response[0].length > 0 ? first_response.response[0][0].total : 0;
        let avail_table = first_response.response[1].length > 0 ? first_response.response[1][0].total : 0;

        let x = operator === '+' ? 0 : 1;
        
        mem_table =  mem_table <= 0 ? x : mem_table;
        avail_table = avail_table <= 0 ? x : avail_table;

        let updatetotalquery = `
        UPDATE tbl_members SET mem_total_services = ${mem_table} ${operator} ${data} WHERE mem_id = ${id};
        UPDATE tbl_avail_member SET service_total = ${avail_table} ${operator} ${data} WHERE mem_id = ${id} AND CAST(avail_mem_date AS DATE) = CAST(CURRENT_DATE AS DATE);
        `; 
          conn.query(updatetotalquery, (error, results) => {
            if (error) {
              callback(null, {success: false})
            } else {
              callback(null, {success: true, response: results})
            }
          });
      } else {
        callback(null, {success: false})
      }
    }
  });
}


function GetAvailableTherapistOnTheDate(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }
    let data = req.body.data || '';
    let getavailabletherapistonthedatequery = `
        SELECT 
        book.book_id,
        book.booked_date,
        mem.mem_id, mem_name
        FROM tbl_bookings book
        LEFT JOIN tbl_members mem ON book.mem_id = mem.mem_id
        WHERE CAST(booked_date AS DATE) = CAST(? AS DATE)
        GROUP BY mem.mem_id;
    `;
    conn.query(getavailabletherapistonthedatequery,[data], (error, results) => {
      conn.release();
      if (error) {
        res.json({em});
      } else {
        res.json({success: true, response: results});
      }
    });
  });
}



function AddMemberToOrderInLogs(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }
    let data = req.body.data || '';
    let checked = req.body.checked || '';
    // let checkmemberifexistquery = `SELECT * FROM tbl_avail_member WHERE mem_id = ? AND branch_id = ?`;
    let addmembertoorderquery = `INSERT INTO tbl_avail_member_log SET ?`;
    let deleteexistingmemberquery = `DELETE FROM tbl_avail_member_log WHERE mem_id = ? AND branch_id = ?`;
    let getlatestorderquery = `SELECT * FROM tbl_avail_member_log WHERE avail_mem_order=(SELECT max(avail_mem_order) FROM tbl_avail_member_log) AND branch_id = ?`;

    async.waterfall([
      checkActionToggled,
      checkMemberIfExistOnTheAvailTable,
    ], function (err, result) {
      conn.release();
      if (err) {
        res.json(em);
      } else {
        res.json({success: true, response: result});
      }
    });

    function checkActionToggled(callback){
      if(checked){
        conn.query(getlatestorderquery, [data.branch_id], (error, results) => {
          if (error) {
            callback(null, {success: false});
          } else {
            callback(null, {success: true, response: results});
          }
        });
      } else {
        conn.query(deleteexistingmemberquery, [data.mem_id, data.branch_id], (error, results) => {
          if (error) {
            callback(null, {success: false});
          } else {
            callback(null, {success: true, response: 'Successfully Removed to Order'});
          }
        });
      }
    }

    function checkMemberIfExistOnTheAvailTable(result_toggled, callback) {
      if(result_toggled.success){
        const latest_order = result_toggled.response.length > 0 ? result_toggled.response[0].avail_mem_order + 1 : 1;
        const toAddData = {
          mem_id: data.mem_id,
          branch_id: data.branch_id,
          avail_mem_order: latest_order
        }
        conn.query(addmembertoorderquery, [toAddData], (error, results) => {
          if (error) {
            callback(null, {success: false});
          } else {
            const x = checked ? 'Added to Order.' : 'Removed from Order.';
            callback(null, {success: true, response:`Successfully ${x}`});
          }
        });
      } else {
        callback(null, {success: false,  response:'Adding to Order Failed'});
      }
    }  
  });
}


function GetTBA(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }
    let id = req.body.data || '';
    let getTBAquery = `SELECT * FROM tbl_members WHERE mem_name = 'TBA' AND branch_id = ${id}`;
    conn.query(getTBAquery, (error, results) => {
      conn.release();
      if (error) {
        res.json({em});
      } else {
        res.json({success: true, response: results});
      }
    });
  });
}

function CheckMemberAvailabilityYesterday(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }
    let id = req.body.data || '';
    const today = moment().format('YYYY-MM-DD');
    let getmemberbybranchquery = `SELECT * FROM tbl_members WHERE branch_id = ? 
    AND mem_in = 'true' AND CAST(mem_date_created AS DATE) = CAST('${today} AS DATE)`;
    conn.query(getmemberbybranchquery, [id], (error, results) => {
      conn.release();
      if (error) {
        res.json({em});
      } else {
        res.json({success: true, response: results});
      }
    });
  });
}





module.exports = {
    getMembers: GetMembers,
    getMembersById: GetMembersById,
    getMembersByBranch: GetMembersByBranch,
    addMember: AddMember,
    updateMember: UpdateMember,
    deleteMember: DeleteMember,
    addMemberToOrder: AddMemberToOrder,
    getAvailabilityByBranch: GetAvailabilityByBranch,
    getAvailabilityByBranchForDashboard: GetAvailabilityByBranchForDashboard,
    getAvailabilityByBranchAndDate: GetAvailabilityByBranchAndDate,
    reorderAvailMembers: ReorderAvailMembers,
    truncateAvailabilities: TruncateAvailabilities,
    updateTotalMemberServices: UpdateTotalMemberServices,
    getAvailableTherapistOnTheDate: GetAvailableTherapistOnTheDate,
    updateMemberRestriction: UpdateMemberRestriction,
    addMemberToOrderInLogs: AddMemberToOrderInLogs,
    getTBA: GetTBA,
    checkMemberAvailabilityYesterday: CheckMemberAvailabilityYesterday
}
