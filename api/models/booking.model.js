const pool = require("../utils/mysql-connection");
const fs = require("fs");
const async = require("async");
const bcrypt = require('bcrypt');
const { first } = require("rxjs");
const moment = require('moment');  

// const CryptoJS = require("crypto-js");
let em = {message: 'Please try again later', code: 503, status: 'Empty Response'};

let formatDate = "YYYY-MM-DD"
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'super_admin ';


function GetBookings(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }
    let data = req.body.data || "";
    let search = req.body.search || "";
    let index = req.body.index >= 0 ? req.body.index : 0;
    let size = req.body.size || 10;

    let getbookingsquery;
    
    if(search.length > 0){
      if(data.length > 0){
        getbookingsquery = `SELECT COUNT(b.service_id) AS total_services, SUM(service_dur) AS total_dur,  GROUP_CONCAT(c.service_name) AS services_name, b.*, COUNT(b.book_guest_id) AS total_pax,
          a.branch_name, c.service_name, c.service_dur, d.room_pax_status
          FROM tbl_bookings b
          JOIN tbl_branch a ON b.branch_id = a.branch_id
          LEFT JOIN tbl_services c ON b.service_id = c.service_id
          LEFT JOIN inf_rooms d ON b.room_id = d.room_id
          WHERE b.book_guest_name LIKE '${search}%' OR
          b.booked_date LIKE CAST('${search}%' AS DATE) 
          AND a.branch_id = ${data}
          GROUP BY b.book_guest_id
          ORDER BY b.book_id DESC, b.booked_date;
          SELECT COUNT(*) AS total_data
          FROM tbl_bookings b
          JOIN tbl_branch a ON b.branch_id = a.branch_id
          LEFT JOIN tbl_services c ON b.service_id = c.service_id
          LEFT JOIN inf_rooms d ON b.room_id = d.room_id
          WHERE b.book_guest_name LIKE '${search}%' OR
          b.booked_date LIKE CAST('${search}%' AS DATE) 
          AND a.branch_id = ${data}`;
      } else {
        getbookingsquery = `SELECT COUNT(b.service_id) AS total_services, SUM(service_dur) AS total_dur,  GROUP_CONCAT(c.service_name) AS services_name, 
          b.*, COUNT(b.book_guest_id) AS total_pax,  a.branch_name, c.service_name, c.service_dur, d.room_pax_status
          FROM tbl_bookings b
          JOIN tbl_branch a ON b.branch_id = a.branch_id
          LEFT JOIN tbl_services c ON b.service_id = c.service_id
          LEFT JOIN inf_rooms d ON b.room_id = d.room_id
          WHERE b.book_guest_name LIKE '${search}%' OR
          b.book_guest_number LIKE '${search}%' OR
          c.service_name LIKE '${search}%'          
          GROUP BY b.book_guest_id
          ORDER BY b.book_id DESC, b.booked_date;
          SELECT COUNT(*) AS total_data
          FROM tbl_bookings b
          JOIN tbl_branch a ON b.branch_id = a.branch_id
          LEFT JOIN tbl_services c ON b.service_id = c.service_id
          LEFT JOIN inf_rooms d ON b.room_id = d.room_id
          WHERE b.book_guest_name LIKE '${search}%' OR
          b.book_guest_number LIKE '${search}%' OR
          b.booked_date LIKE '${search}%' OR
          c.service_name LIKE '${search}%'`;
      }    
    } else {
      if(data.length > 0){
        getbookingsquery = `SELECT COUNT(b.service_id) AS total_services, SUM(service_dur) AS total_dur,  GROUP_CONCAT(c.service_name) AS services_name, b.*, COUNT(b.book_guest_id) AS total_pax, 
            a.branch_name, c.service_name, c.service_dur, d.room_pax_status
            FROM tbl_bookings b
            JOIN tbl_branch a ON b.branch_id = a.branch_id
            LEFT JOIN tbl_services c ON b.service_id = c.service_id
            LEFT JOIN inf_rooms d ON b.room_id = d.room_id
            WHERE a.branch_id = ${data}
            GROUP BY b.book_guest_id
            ORDER BY b.book_id DESC, b.booked_date;
            SELECT COUNT(*) AS total_data
            FROM tbl_bookings b
            JOIN tbl_branch a ON b.branch_id = a.branch_id
            LEFT JOIN tbl_services c ON b.service_id = c.service_id
            LEFT JOIN inf_rooms d ON b.room_id = d.room_id
            WHERE a.branch_id = ${data}      
            GROUP BY b.book_guest_id`;
      } else {
        getbookingsquery = `SELECT COUNT(b.service_id) AS total_services, SUM(service_dur) AS total_dur,  GROUP_CONCAT(c.service_name) AS services_name, 
        b.*, COUNT(b.book_guest_id) AS total_pax,  a.branch_name, c.service_name, c.service_dur, d.room_pax_status
        FROM tbl_bookings b
        JOIN tbl_branch a ON b.branch_id = a.branch_id
        LEFT JOIN tbl_services c ON b.service_id = c.service_id
        LEFT JOIN inf_rooms d ON b.room_id = d.room_id
        GROUP BY b.book_guest_id
        ORDER BY b.book_id DESC, b.booked_date
        LIMIT ${index}, ${size};
        SELECT COUNT(*) AS total_data FROM tbl_bookings b
        JOIN tbl_branch a ON b.branch_id = a.branch_id
        LEFT JOIN tbl_services c ON b.service_id = c.service_id   
        LEFT JOIN inf_rooms d ON b.room_id = d.room_id;`
      }
    }
    conn.query(getbookingsquery, (error, results) => {
      conn.release();
      if (error) {    
        res.json({em});
      } else {
        res.json({success: true, response: results[0], total: results[0].length > 0 ? results[1][0].total_data : 0});
      }
    });
  });  
}

function AddBookingsInTimeGrid(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }
    let data = req.body.data || '';

    async.waterfall([
      getLatestBookingId,
      addBookingToDatabase,
  ], function (err, result) {
    conn.release();
    if (err) {
      res.json(em);
    } else {
      if(result.success){
        res.json({success: result.success, response: 'Booking was added successfully!'})
      }
    }
  });

  function getLatestBookingId(callback){
    let getlastestbookguestidquery = `SELECT MAX(book_guest_id) as id, MAX(book_pax_id) as pax_id  FROM tbl_bookings`;
    conn.query(getlastestbookguestidquery, [data],(error, results) => {
      if (error) {    
        callback(null, {success: false})
      } else {        
      callback(null, {success: true, response: results})
      }
    });
  }

  function addBookingToDatabase(result, callback){
    if(result.success){
      if(data.length > 0){
        let addbookingsquery = `INSERT INTO tbl_bookings SET ?`;
        data.forEach(el =>{
          conn.query(addbookingsquery, [el],(error, results) => {
            if (error) throw error;
            if(error) {callback(null, {success: false})}
          });
        })
        callback(null, {success: true});
      } else {
        let book_guest_id = result.response[0].id;
        data.book_guest_id = book_guest_id + 1;
        data.book_pax_id = result.response[0].pax_id + 1;
        let addbookingsquery = `INSERT INTO tbl_bookings SET ?`;
        conn.query(addbookingsquery, [data],(error, results) => {
          if (error) {    
            callback(null, {success: false})
          } else {        
          callback(null, {success: true})
          }
        });
      }
    } else {
      callback(null, {success: false})
    }
  }    
  });
}

function AddBooking(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }
    let data = req.body.data || '';

    async.waterfall([
      getLatestBookingId,
      addBookingToDatabase,
  ], function (err, result) {
    conn.release();
    if (err) {
      res.json(em);
    } else {
      if(result.success){
        res.json({success: result.success, response: 'Booking was added successfully!'})
      }
    }
  });

  function getLatestBookingId(callback){
    let getlastestbookguestidquery = `SELECT MAX(book_guest_id) as id, MAX(book_pax_id) as pax_id  FROM tbl_bookings`;
    conn.query(getlastestbookguestidquery, [data],(error, results) => {
      if (error) {    
        callback(null, {success: false})
      } else {        
      callback(null, {success: true, response: results})
      }
    });
  }

  function addBookingToDatabase(result, callback){
    if(result.success){
      let book_guest_id = result.response[0].id;
      data.book_guest_id = book_guest_id + 1;
      data.book_pax_id = result.response[0].pax_id + 1;
      let addbookingsquery = `INSERT INTO tbl_bookings SET ?`;
      conn.query(addbookingsquery, [data],(error, results) => {
        if (error) {    
          callback(null, {success: false})
        } else {        
        callback(null, {success: true})
        }
      });
    } else {
      callback(null, {success: false})
    }
  }    
  });
}



function AddAdditionalBooking(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }
    let data = req.body.data || '';
    let id = req.body.id || '';
    async.waterfall([
      addBookingToDatabase,
      getAvailMember,
      updateAvailMember,
  ], function (err, result) {
    conn.release();
    if (err) {
      res.json(em);
    } else {
      if(result.success){
        res.json({success: result.success, response: 'Booking was added successfully!'})
      }
    }
  });

  function addBookingToDatabase(callback){
    let query_result = [];
      if(data.length > 0){
        data.forEach(el =>{
          let book_guest_id = el.book_guest_id;
          el.book_guest_id = book_guest_id + 1;
          let addbookingsquery = `INSERT INTO tbl_bookings SET ?`;
          conn.query(addbookingsquery, [el],(error, results) => {
            query_result.push(!error);
          });
        });
        callback(null, {success: query_result.length > 0 ? false : true});
      }  else {
        callback(null, {success: false});  
    }    
  }
  
  function getAvailMember(second_result, callback){
    if(second_result.success){
      let updateavailmemberquery = `SELECT COUNT(service_id) AS total_services FROM tbl_bookings WHERE mem_id = ? AND CAST(booked_date AS DATE) = CAST(CURRENT_DATE AS DATE)`;
      conn.query(updateavailmemberquery, [id], (error, results) => {
        if(error){          
          callback(null, {success: false});   
        } else {
        callback(null, {success: results.length > 0 ? true : false, response: results[0].total_services});     
        }
      });
    } else {
      callback(null, {success: false});  
    }   
  }  

  function updateAvailMember(third_result, callback){
    if(third_result.success){
      let data = {
        service_total: third_result.response
      }
      let updateavailmemberquery = `UPDATE tbl_avail_member SET ? WHERE mem_id = ?`;
      conn.query(updateavailmemberquery, [data, id], (error, results) => {
        if(error){          
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

function RemoveAllServiceUpdateBooking(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }
    let data = req.body.data || '';
    let remove = req.body.id || '';
    let stay = req.body.book_id || '';
    let removeallservicebookingsquery = `DELETE FROM tbl_bookings WHERE NOT book_id = ? AND book_guest_id = ?`;
    let updateremainingservicequery = `UPDATE tbl_bookings SET ? WHERE book_id = ?`;

    async.waterfall([
      removeAllServiceOnGuest,
      updateRemainingService,
    ], function (err, result) {
      conn.release();
      if (err) {
        res.json(em);
      } else {
        if(result.success){
          res.json({success: result.success, response: 'Booking was added successfully!'})
        }
      }
    });
    function removeAllServiceOnGuest(callback){
      conn.query(removeallservicebookingsquery, [stay, remove],(error, results) => {
        if (error) {    
          callback(null, {success: false})
        } else {        
        callback(null, {success: true})
        }
      });
    }
  
    function updateRemainingService(first_result, callback){
      if(first_result){
        data.service_id = 0;
        conn.query(updateremainingservicequery, [data, stay],(error, results) => {
          if (error) {    
            callback(null, {success: false})
          } else {        
          callback(null, {success: true})
          }
        });
      } else {
        callback(null, {success: false});
      }
    }
  });
}


function UpdateBooking(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }
    let data = req.body.data || '';
    let id = req.body.id || '';
    let updatebookingsquery = `UPDATE tbl_bookings SET ? WHERE book_id = ?`;
    conn.query(updatebookingsquery, [data, id],(error, results) => {
        conn.release();
          if (error) {    
              res.json({em});
          } else {
              res.json({success: true, response: 'Booking Updated!'});
          }
    });
  });
}

function UpdateBookingByGuestId(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }
    let data = req.body.data || '';
    let id = req.body.id || '';
    let updatebookingsquery = `UPDATE tbl_bookings SET ? WHERE book_guest_id = ?`;
    conn.query(updatebookingsquery, [data, id],(error, results) => {
      conn.release();
      if (error) {    
        res.json({em});
      } else {
        res.json({success: true, response: 'Booking Updated!'});
      }
    });
  });
}


function UpdateBookingByGuestIdAndDate(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }
    let data = req.body.data || '';
    let id = req.body.id || '';
    let date = req.body.date || '';
    let date2 = moment(date).format(formatDate);
    let updatebookingdatesquery = `UPDATE tbl_bookings SET ? WHERE book_guest_id = ? AND CAST(booked_date AS DATE) = CAST("${date2}" AS DATE)`;
    conn.query(updatebookingdatesquery, [data, id],(error, results) => {
      conn.release();
      console.log(updatebookingdatesquery);
      if (error) {    
          res.json({em});
      } else {
          res.json({success: true, response: 'Booking Updated!'});
      }
    });
  });
}




function GetClientsBooking(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }   
  
    let data = req.body.data || '';
    let getclientsbookingquery = `
        SELECT b.*, a.branch_name, c.service_name,c.service_price, c.service_dur,  disc.*
        FROM tbl_bookings b
        JOIN tbl_branch a ON b.branch_id = a.branch_id
        LEFT JOIN inf_discounts disc ON disc.disc_id = b.disc_id
        LEFT JOIN tbl_services c ON b.service_id = c.service_id WHERE b.book_guest_id = ?
    `;
    conn.query(getclientsbookingquery,[data],(error, results) => {
      conn.release();
      if (error) {    
        res.json({em});
      } else {
        res.json({success: true, response: results});
      }
    });
  });
}


function GetClientsBookingAndDate(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }   
  
    let data = req.body.data || '';
    let date = req.body.date || '';
    let getclientsbookinganddatequery = `
        SELECT b.*, a.branch_name, c.service_name,c.service_price, c.service_dur,  disc.*
        FROM tbl_bookings b
        JOIN tbl_branch a ON b.branch_id = a.branch_id
        LEFT JOIN inf_discounts disc ON disc.disc_id = b.disc_id
        LEFT JOIN tbl_services c ON b.service_id = c.service_id WHERE b.book_guest_id = ? AND
        CAST(b.booked_date AS DATE) = CAST(? AS DATE)
    `;
    conn.query(getclientsbookinganddatequery, [data, date],(error, results) => {
      conn.release();
      console.log(getclientsbookinganddatequery);
      if (error) {    
        res.json({em});
      } else {
        res.json({success: true, response: results});
      }
    });
  });
}

function GetClientsWithConcatBooking(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }   
    
    let data = req.body.data || '';
    let getclientsbookingwithconcatquery = `
              SELECT  GROUP_CONCAT(c.service_name) AS services_name, m.mem_name, i.room_name, b.*, a.branch_name, d.disc_percent, d.disc_name
              FROM tbl_bookings b
              JOIN tbl_branch a ON b.branch_id = a.branch_id
              LEFT JOIN tbl_services c ON b.service_id = c.service_id
              LEFT JOIN tbl_members m ON b.mem_id = m.mem_id		
              LEFT JOIN inf_rooms i ON i.room_id = b.room_id	
              LEFT JOIN inf_discounts d ON d.disc_id = b.disc_id											 
              WHERE b.book_guest_id = ?
    `;
    conn.query(getclientsbookingwithconcatquery, [data],(error, results) => {
      conn.release();
      if (error) {    
        res.json({em});
      } else {
        res.json({success: true, response: results});
      }
    });
  });
}



function UpdateMoreServiceBooking(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }
    let data = req.body.data || [];
    let id = req.body.id || '';
    let member = req.body.member || 0;
    let total_services_selected = data ? data.length : 0;
    async.waterfall([
        removeFirstBookings,
        insertBookings,
        getAvailMember,
        updateAvailMember,
        // updateTotalServices        
    ], function (err, result) {
      conn.release();
      if (err) {
        res.json(em);
      } else {
        if(result.success){
          res.json({success: result.success, response: 'Booking was updated successfully!'})
        }
      }
    });
    function removeFirstBookings(callback){
        let removebookingquery = `DELETE FROM tbl_bookings WHERE book_guest_id = ?`;
        conn.query(removebookingquery, [id],(error, results) => {
          if (error) {
            callback(null, {success: false});  
          } else {
            callback(null, {success: true}); 
          }
        });
    }

    function insertBookings(first_result, callback){
      if(first_result.success){
        let query_result = [];
        data.forEach(el =>{
          delete el.book_id;
          delete el.room_pax_status;
          let insertservicebookingquery = `INSERT INTO tbl_bookings SET ?`;
          conn.query(insertservicebookingquery, [el], (error, results) => {
            query_result.push(!error);
          });
        });
        callback(null, {success: query_result.length > 0 ? false : true});   
      } else {
        callback(null, {success: false});  
      }   
    }  
    
    function getAvailMember(second_result, callback){
      if(second_result.success){
        let updateavailmemberquery = `SELECT COUNT(service_id) AS total_services FROM tbl_bookings WHERE mem_id = ? AND CAST(booked_date AS DATE) = CAST(CURRENT_DATE AS DATE)`;
        conn.query(updateavailmemberquery, [member], (error, results) => {
          if(error){          
            callback(null, {success: false});   
          } else {
          callback(null, {success: results.length > 0 ? true : false, response: results[0].total_services});     
          }
        });
      } else {
        callback(null, {success: false});  
      }   
    }    
    
    // function updateRoomtoPending(third_result, callback){
    //   if(third_result.success){
    //     let data = {
    //       service_total: third_result.response
    //     }
    //     let updateavailmemberquery = `UPDATE inf_room SET ? WHERE mem_id = ?`;
    //     conn.query(updateavailmemberquery, [data, member], (error, results) => {
    //       if(error){          
    //         callback(null, {success: false});   
    //       } else {
    //         callback(null, {success: true});  
    //       }
    //     });
    //   } else {
    //     callback(null, {success: false});  
    //   }   
    // }   

    function updateAvailMember(third_result, callback){
      if(third_result.success){
        let data = {
          service_total: third_result.response
        }
        let updateavailmemberquery = `UPDATE tbl_avail_member SET ? WHERE mem_id = ?`;
        conn.query(updateavailmemberquery, [data, member], (error, results) => {
          if(error){          
            callback(null, {success: false});   
          } else {
            callback(null, {success: true});  
          }
        });
      } else {
        callback(null, {success: false});  
      }   
    }        
        
    function updateTotalServices(third_result, callback){
      if(third_result.success){
        let updatetotalservicesquery = `UPDATE tbl_members SET mem_total_services = mem_total_services + ? WHERE mem_id = ?`;
        conn.query(updatetotalservicesquery, [total_services_selected, member], (error, results) => {
          if(error){          
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

function DeleteBooking(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }
    let id = req.body.data || '';
    let getbookingdataquery = `SELECT * FROM tbl_bookings WHERE book_id = ?`;
    let insertbookingdataquery = `INSERT INTO tbl_bookings_archived SET ?`;
    let removebookingsquery = `DELETE FROM tbl_bookings WHERE book_id = ?`;
    
    async.waterfall([
      getBookingData,
      insertBookingDataToArchived,
      removeFromBookingTable,
    ], function (err, result) {
      conn.release();
      if (err) {
        res.json(em);
      } else {
        if(result.success){
          res.json({success: result.success, response: 'Booking was removed successfully!'})
        }
      }
    });

    function getBookingData(callback){        
      conn.query(getbookingdataquery, [id],(error, results) => {
        if (error) {    
          callback(null, {success: false})
        } else {
          callback(null, {success: true, response: results});
        }
      });
    }

    function insertBookingDataToArchived(first_response, callback){    
      if(first_response.success)  {
        conn.query(insertbookingdataquery, [first_response.response[0]],(error, results) => {
          if (error) {    
            callback(null, {success: false})
          } else {
            callback(null, {success: true, response: results});
          }
        });
      }  
    }

    function removeFromBookingTable(second_response, callback){
      if(second_response.success){
        conn.query(removebookingsquery, [id], (error, results) => {
          if (error) {
            callback(null, {success: false})
          } else {
            callback(null, {success: true});
          }
        });
      }
    }
    
  });
}

function GetTotalBookingsAsOfToday(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }
    const today = moment().format('YYYY-MM-DD');
    let getbookingsnowquery = `SELECT COUNT(*) AS total  FROM tbl_bookings
      WHERE CAST(booked_date AS DATE) = ${today};
      SELECT COUNT(*) AS total  FROM tbl_avail_member WHERE CAST(avail_mem_date AS DATE) = CAST('${today}' AS DATE);
      SELECT COUNT(*) AS total  FROM inf_rooms;`;
    conn.query(getbookingsnowquery, (error, results) => {
      conn.release();
      if (error) {    
        res.json({em});
      } else {
        res.json({success: true, response: results});
      }
    });
  });
}

function AddGuestBooking(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }
    let data = req.body.data || '';

    async.waterfall([
      addGuestBooking,
    ], function (err, result) {
      conn.release();
      if (err) {
        res.json(em);
      } else {
        if(result.success){
          res.json({success: result.success, response: 'Booking was added successfully!'})
        }
      }
    });

    function addGuestBooking(callback){
        let addguestookingsquery = `INSERT INTO tbl_bookings SET ?`;
        if(data.length > 0){
            let query_result = [];
            data.forEach(el => {
              delete el.book_id;
              conn.query(addguestookingsquery, [el], (error, results) => {
                query_result.push(!error);   
              });    
              callback(null, {success: query_result.length > 0 ? false : true});          
            })    
        } else {
          callback(null, {success: false})
        }      
    } 

    });
  }



function GetLatestBookPaxId(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }
      let getmaxbookpaxidquery = `SELECT MAX(book_pax_id) as book_pax_id FROM tbl_bookings;`;
      conn.query(getmaxbookpaxidquery, (error, results) => {
        conn.release();
        if (error) {    
          res.json({em});
        } else {
          res.json({success: true, response: results});
        }
      });
    });
  }
  
function GetAllClientsName(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }
      let getallclientsnamequery = `  SELECT * FROM tbl_bookings GROUP BY book_guest_id ORDER BY book_guest_name ASC`;
      conn.query(getallclientsnamequery, (error, results) => {
        conn.release();
        if (error) {    
          res.json({em});
        } else {
          res.json({success: true, response: results});
        }
      });
    });
  }

  
  
function CalendarEventDisplay(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }
      let data = req.body.data || '';
      let query_error = [];
      let query_result = [];

      async.waterfall([
        getcurrentdisplaymonth,
      ], function (err, result) {
        conn.release();
        if (err) {
          res.json(em);
        } else {
          if(result.success){
            res.json({success: result.success, response: result.response})
          } else{
            res.json({success: false, response: result.response})
          }
        }
      });
     
  
      function getcurrentdisplaymonth(callback){
        if(data.length > 0) {
          data.forEach(item =>{
            let calendareventdisplayquery = `
                SELECT *, 
                    CASE 
                        WHEN booked_status = 0 THEN (SELECT COUNT(*) FROM tbl_bookings WHERE CAST(booked_date AS DATE) = CAST('${item}' AS DATE)
                          AND booked_status = 0)
                        WHEN booked_status = 1 THEN (SELECT COUNT(*) FROM tbl_bookings WHERE CAST(booked_date AS DATE) = CAST('${item}' AS DATE)
                          AND booked_status = 1)  
                        WHEN booked_status = 2 THEN (SELECT COUNT(*) FROM tbl_bookings WHERE CAST(booked_date AS DATE) = CAST('${item}' AS DATE)
                          AND booked_status = 2) 
                        WHEN booked_status = 3 THEN (SELECT COUNT(*) FROM tbl_bookings WHERE CAST(booked_date AS DATE) = CAST('${item}' AS DATE)
                          AND booked_status = 3) 
                      ELSE 0 
                    END AS total
                FROM tbl_bookings WHERE CAST(booked_date AS DATE) = CAST('${item}' AS DATE) GROUP BY total
              `;
            conn.query(calendareventdisplayquery, (error, results) => {
              query_error.push(!error);
              if(results[0]){
                if(results.length > 1){
                  for (let i = 0; i < results.length; ++i) {
                    query_result.push(results[i]);
                  }
                } else {
                  query_result.push(results[0]);
                }
              }
            });  
          })
          setTimeout(el => {
            callback(null, {success: true, response: query_result})
          }, 1500)
        } else {
          callback(null, {success: false})
        }
      } 
    });
  }


  function GetCurrentTimeBookings(req, res) {
    pool.getConnection((error, conn) => {
      if (error) {
        if (conn) conn.release();
        res.json({code: 100, status: "Error in connecting to the database"});
        return;
      }
        let data = req.body.data || '';
        const date = moment(data.date).format('YYYY-MM-DD');
        const starttime = moment(data.time).format('HH:mm:ss');
        const endtime = moment(data.time).add(1, 'hours').format('HH:mm:ss')
        let getcurrenttimebookinquery = `SELECT room_id FROM tbl_bookings WHERE CAST(booked_date AS DATE) = CAST('${date}' AS DATE) AND
         CAST(time_start AS TIME) BETWEEN '${starttime}' AND '${endtime}' AND booked_status = 3`;
        conn.query(getcurrenttimebookinquery, (error, results) => {
          conn.release();
          if (error) {    
            res.json({em});
          } else {
            res.json({success: true, response: results});
          }
        });
      });
    }

    function GenerateReports(req, res) {
      pool.getConnection((error, conn) => {
        if (error) {
          if (conn) conn.release();
          res.json({code: 100, status: "Error in connecting to the database"});
          return;
        }
          let data = req.body.data || '';
          let type = req.body.type || 1;
          
          const start = moment(data.start).format('YYYY-MM-DD');
          const end = moment(data.end).format('YYYY-MM-DD');

          let generatereportquery = `
              SELECT b.*,
              s.service_name, s.service_dur, s.service_code,s.item_code, m.mem_name, d.disc_name, disc_percent FROM tbl_bookings b 
              JOIN tbl_services s ON b.service_id = s.service_id 
              LEFT JOIN tbl_members m ON b.mem_id = m.mem_id
              LEFT JOIN inf_discounts d ON b.disc_id = d.disc_id
              WHERE CAST(booked_date AS DATE) BETWEEN '${start}' and '${end}' AND booked_status = ${type};
              SELECT SUM(b.price) AS gross, SUM(b.total_price) AS net FROM tbl_bookings b 
              JOIN tbl_services s ON b.service_id = s.service_id 
              LEFT JOIN tbl_members m ON b.mem_id = m.mem_id
              LEFT JOIN inf_discounts d ON b.disc_id = d.disc_id
              WHERE CAST(booked_date AS DATE) BETWEEN '${start}' and '${end}' AND booked_status = ${type};
          `;
          conn.query(generatereportquery, (error, results) => {
            conn.release();
            if (error) {    
              res.json({em});
            } else {
              res.json({success: true, response: results});
            }
          });
        });
      }

      

    function TodaysTotalBooking(req, res) {
      pool.getConnection((error, conn) => {
        if (error) {
          if (conn) conn.release();
          res.json({code: 100, status: "Error in connecting to the database"});
          return;
        }          
          const today = moment().format('YYYY-MM-DD');
          let todaystotalbookingquery = `SELECT COUNT(*) AS total FROM tbl_bookings WHERE CAST(booked_date AS DATE) = '${today}'`;
          conn.query(todaystotalbookingquery, (error, results) => {
            conn.release();
            if (error) {    
              res.json({em});
            } else {
              res.json({success: true, response: results});
            }
          });
        });
      }


  
function GetAllCounts(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }
    let getallcountbookingswuery =
     `SELECT COUNT(*) AS total FROM tbl_members;
      SELECT COUNT(*) AS total FROM tbl_bookings;   
      SELECT COUNT(*) AS total FROM tbl_services;`;
    conn.query(getallcountbookingswuery,(error, results) => {
      conn.release();
      if (error) {    
        res.json({em});
      } else {
        res.json({success: true, response: results});
      }
    });
  });
}


function GetTherapistBookings(req, res){
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }
    let data = req.body.data || '';
    let gettherapistbookingsquery = `
            SELECT b.*, COUNT(b.book_guest_id) AS total_pax,
            a.branch_name, c.service_name, c.service_dur, SUM(c.service_dur) AS total_dur, d.room_pax_status, m.mem_name
            FROM tbl_bookings b
            JOIN tbl_branch a ON b.branch_id = a.branch_id
            LEFT JOIN tbl_services c ON b.service_id = c.service_id
            LEFT JOIN inf_rooms d ON b.room_id = d.room_id
            LEFT JOIN tbl_members m ON m.mem_id = b.mem_id
            WHERE m.mem_id = ?
            GROUP BY b.book_id
            ORDER BY b.booked_date DESC
    `;
    conn.query(gettherapistbookingsquery, [data], (error, results) => {
      conn.release();
      if (error) {    
        res.json({em});
      } else {
        res.json({success: true, response: results});
      }
    });
  });
}



function TransferBooking(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }
    let data = req.body.data || '';
    let id = req.body.book_id || '';
    let old = req.body.old_mem || '';

    async.waterfall([
        first__removebookingcountonold,
        second__addbookingcountonnew,
        third__updatebookingtherapist,
      ], function (err, result) {
        conn.release();
        if (err) {
          res.json(em);
        } else {
          if(result.success){
            res.json({success: result.success, response: result.response})
          } else{
            res.json({success: false, response: result.response})
          }
        }
    });

    function first__removebookingcountonold(callback){
      let first__removebookingcountonoldquery = `
        UPDATE tbl_avail_member SET service_total = service_total - 1 WHERE mem_id = ${old};
        UPDATE tbl_members SET mem_total_services = mem_total_services - 1 WHERE mem_id = ${old};
      `;
        conn.query(first__removebookingcountonoldquery, (error, results) => {
          if (error) {
            callback(null, {success: false});  
          } else {
            callback(null, {success: true, response: results}); 
          }
        });     
    } 
    function second__addbookingcountonnew(first_response, callback){
      if(first_response.success) {
        let second__addbookingcountonnewquery = `
          UPDATE tbl_avail_member SET service_total = service_total + 1 WHERE mem_id = ${data.mem_id};
          UPDATE tbl_members SET mem_total_services = mem_total_services + 1 WHERE mem_id = ${data.mem_id};
        `;
          conn.query(second__addbookingcountonnewquery,(error, results) => {
            if (error) {
              callback(null, {success: false});  
            } else {
              callback(null, {success: true, response: results}); 
            }
        }); 
      } else {
        callback(null, {success: false}); 
      }
    } 
    function third__updatebookingtherapist(second_response, callback){
      if(second_response.success) {
        let third__updatebookingtherapistquery = `
            UPDATE tbl_bookings SET ? WHERE book_id = ?
        `;
          conn.query(third__updatebookingtherapistquery, [data, id],(error, results) => {
            if (error) {
              callback(null, {success: false});  
            } else {
              callback(null, {success: true, response: results}); 
            }
        }); 
      } else {
        callback(null, {success: false}); 
      }
    } 


  });
}



function GetAvailableTherapistBookingsSchedules(req, res){
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }
    let data = req.body.data || null;
    let getavailabletherapistbookingsschedule; 
    if(data){
      getavailabletherapistbookingsschedule = `
              SELECT b.*, COUNT(b.book_guest_id) AS total_pax,
              a.branch_name, c.service_name, c.service_dur, SUM(c.service_dur) AS total_dur, d.room_pax_status, m.mem_name, m.mem_restricted
              FROM tbl_bookings b
              JOIN tbl_branch a ON b.branch_id = a.branch_id
              LEFT JOIN tbl_services c ON b.service_id = c.service_id
              LEFT JOIN inf_rooms d ON b.room_id = d.room_id
              LEFT JOIN tbl_members m ON m.mem_id = b.mem_id
              WHERE CAST(b.booked_date AS DATE) = CAST('${data}' AS date)
              GROUP BY b.book_id
              ORDER BY b.booked_date DESC
      `;
    } else {
      getavailabletherapistbookingsschedule = `
              SELECT CAST(b.booked_date AS DATE) AS booked_date, b.*, COUNT(b.book_guest_id) AS total_pax,
              a.branch_name, c.service_name, c.service_dur, SUM(c.service_dur) AS total_dur, d.room_pax_status, m.mem_name, m.mem_restricted
              FROM tbl_bookings b
              JOIN tbl_branch a ON b.branch_id = a.branch_id
              LEFT JOIN tbl_services c ON b.service_id = c.service_id
              LEFT JOIN inf_rooms d ON b.room_id = d.room_id
              LEFT JOIN tbl_members m ON m.mem_id = b.mem_id
              WHERE CAST(b.booked_date AS DATE) = CAST(CURDATE() AS date)
              GROUP BY b.book_id
              ORDER BY b.booked_date DESC
      `;
    }
    conn.query(getavailabletherapistbookingsschedule, (error, results) => {
      conn.release();
      if (error) {    
        res.json({em});
      } else {
        res.json({success: true, response: results});
      }
    });
  });
}


function GetMaxOfColumn(req, res){
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }
    let data = req.body.data || 'book_guest_id';
    let getmexofcolumnquery = `
        SELECT MAX(${data}) AS max FROM tbl_bookings
    `;
    conn.query(getmexofcolumnquery, (error, results) => {
      conn.release();
      if (error) {    
        res.json({em});
      } else {
        res.json({success: true, response: results});
      }
    });
  });
}

function CheckBookingByDateSelect(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }
    let date = req.body.date || "";
    let id = req.body.id || "";

    let checkbookingbydateselectquery =
     `SELECT COUNT(b.service_id) AS total_services, SUM(service_dur) AS total_dur, 
     GROUP_CONCAT(c.service_name) AS services_name, b.*, COUNT(b.book_guest_id) AS total_pax, 
     a.branch_name, c.service_name, c.service_dur, d.room_pax_status, m.mem_name
     FROM tbl_bookings b
     JOIN tbl_branch a ON b.branch_id = a.branch_id
     LEFT JOIN tbl_services c ON b.service_id = c.service_id
     LEFT JOIN inf_rooms d ON b.room_id = d.room_id
     LEFT JOIN tbl_members m ON b.mem_id = m.mem_id
     WHERE a.branch_id = ${id} AND CAST(b.booked_date AS DATE) = CAST("${date}" AS DATE)
     GROUP BY b.book_guest_id
     ORDER BY b.book_id DESC, b.booked_date;`;

    conn.query(checkbookingbydateselectquery,(error, results) => {
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
    getBookings: GetBookings,
    addBooking: AddBooking,
    addBookingsInTimeGrid: AddBookingsInTimeGrid,
    updateBooking: UpdateBooking,
    updateBookingByGuestId: UpdateBookingByGuestId,
    updateBookingByGuestIdAndDate: UpdateBookingByGuestIdAndDate,
    deleteBooking: DeleteBooking,
    updateMoreServiceBooking: UpdateMoreServiceBooking,
    getTotalBookingsAsOfToday: GetTotalBookingsAsOfToday,
    getClientsBooking: GetClientsBooking,
    removeAllServiceUpdateBooking: RemoveAllServiceUpdateBooking,
    addGuestBooking: AddGuestBooking,
    getLatestBookPaxId: GetLatestBookPaxId,
    getAllClientsName: GetAllClientsName,
    addAdditionalBooking: AddAdditionalBooking,
    calendarEventDisplay: CalendarEventDisplay,
    getCurrentTimeBookings: GetCurrentTimeBookings,
    generateReports: GenerateReports,
    getAllCounts: GetAllCounts,
    getTherapistBookings: GetTherapistBookings,
    getClientsWithConcatBooking: GetClientsWithConcatBooking,
    transferBooking: TransferBooking,
    getAvailableTherapistBookingsSchedules: GetAvailableTherapistBookingsSchedules,
    getMaxOfColumn: GetMaxOfColumn,
    checkBookingByDateSelect: CheckBookingByDateSelect,
    getClientsBookingAndDate: GetClientsBookingAndDate
}
