const pool = require("../utils/mysql-connection");
const fs = require("fs");
const async = require("async");
const bcrypt = require('bcrypt');
const moment = require('moment');

let em = {message: 'Please try again later', code: 503, status: 'Empty Response'};

/*----------------------------------
             Navs
-----------------------------------*/
function GetNavs(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }
    let getnavsquery = `SELECT * FROM inf_navs ORDER BY nav_order ASC`;
    conn.query(getnavsquery, (error, results) => {
      conn.release();
      if (error) {
        res.json({em});
      } else {
        res.json({success: true, response: results});
      }
    });
  });
}
function GetNavsWithPrivs(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }
    let data = req.body.data || '';
    let getnavswithprivsquery = `SELECT * FROM inf_navs a
        JOIN tbl_privileges_setting b ON a.nav_id = b.nav_id
        WHERE b.acc_id = ?
        ORDER BY nav_order ASC`;
    conn.query(getnavswithprivsquery,[data], (error, results) => {
      conn.release();
      if (error) {
        res.json({em});
      } else {
        res.json({success: true, response: results});
      }
    });
  });
}

/*----------------------------------
             Discounts
-----------------------------------*/

function GetDiscounts(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }
    let search = req.body.data || '';
    // let search = req.body.search || '';
    let getdiscountquery;
    if(search.length > 0){
      getdiscountquery = `
        SELECT * FROM inf_discounts WHERE
        disc_name LIKE '${search}%' OR
        disc_percent LIKE '${search}%' 
        ORDER BY disc_id ASC
      `;
    } else {
      getdiscountquery = `SELECT * FROM inf_discounts ORDER BY disc_id ASC`;
    }

    conn.query(getdiscountquery, (error, results) => {
      conn.release();
      if (error) {
        res.json({em});
      } else {
        res.json({success: true, response: results});
      }
    });
  });
}


function GetPercentDiscount(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }
    let data = req.body.data || '';
    let getpercentdiscountquery = `SELECT disc_percent FROM inf_discounts WHERE disc_id = ?`;
    conn.query(getpercentdiscountquery,[data], (error, results) => {
      conn.release();
      if (error) {
        res.json({em});
      } else {
        res.json({success: true, response: results});
      }
    });
  });
}
function AddDiscount(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }
    let data = req.body.data || '';
    let adddiscountquery = `INSERT INTO inf_discounts SET ?`;
    conn.query(adddiscountquery,[data], (error, results) => {
      conn.release();
      if (error) {
        res.json({em});
      } else {
        res.json({success: true, response: 'Discount Successfully Added.'});
      }
    });
  });
}

function UpdateDiscount(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }
    let data = req.body.data || '';
    let id = req.body.id || '';
    let adddiscountquery = `UPDATE inf_discounts SET ? WHERE disc_id = ?`;
    conn.query(adddiscountquery,[data,id], (error, results) => {
      conn.release();
      if (error) {
        res.json({em});
      } else {
        res.json({success: true, response: 'Discount Successfully Updated.'});
      }
    });
  });
}

function DeleteDiscount(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }

    let id = req.body.data || '';
    let deleteservicesgroupquery = `DELETE FROM inf_discounts WHERE disc_id = ?`
    conn.query(deleteservicesgroupquery, [id], (error, results) => {
      conn.release();
      if (error) {
        res.json({em});
      } else {
        res.json({success: true, response: 'Discount Successfully Deleted.'});
      }
    });
  });
}

/*----------------------------------
             Privileges
-----------------------------------*/
function GetPrivs(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }
    let getprivquery = `SELECT * FROM tbl_privileges`;
    conn.query(getprivquery, (error, results) => {
      conn.release();
      if (error) {
        res.json({em});
      } else {
        res.json({success: true, response: results});
      }
    });
  });
}

function GetPrivOfTheAccount(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }
    let data = req.body.data || '';
    let getprivoftheaccountquery = `
        SELECT b.*, c.*, a.acc_id, a.priv_id FROM tbl_accounts a
        RIGHT JOIN tbl_privileges b ON a.priv_id = b.priv_id
        LEFT JOIN tbl_privileges_setting c ON b.priv_id = c.priv_id
        WHERE c.acc_id = ? GROUP BY c.nav_id
    `;
    conn.query(getprivoftheaccountquery,[data], (error, results) => {
      conn.release();
      if (error) {
        res.json({em});
      } else {
        res.json({success: true, response: results});
      }
    });
  });
}

function UpdatePrivilegesSettings(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }
    let data = req.body.data || '';   
    let toUpdateData = {
      view: data.view,
      add: data.add,
      update: data.update,
      delete: data.delete,
    }
    let updateprivilegessettingsquery = `UPDATE tbl_privileges_setting SET ? WHERE sett_id = ?`;
      conn.query(updateprivilegessettingsquery,[toUpdateData, data.sett_id], (error, results) => {
        conn.release();
        if (error) {
          res.json({em});
        } else {
          res.json({success: true, response: results});
        }
      });
  });
}




/*----------------------------------
             Branches
-----------------------------------*/
function GetBranches(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }
    let getbranchesquery = `SELECT * FROM tbl_branch`;
    conn.query(getbranchesquery, (error, results) => {
      conn.release();
      if (error) {
        res.json({em});
      } else {
        res.json({success: true, response: results});
      }
    });
  });
}
function AddBranch(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }
    let data = req.body.data || '';
    let updatebranchesquery = `INSERT INTO tbl_branch SET ?`;
    conn.query(updatebranchesquery, [data],(error, results) => {
      conn.release();
      if (error) {
        res.json({em});
      } else {
        res.json({success: true, response: 'Branch was successfully added!'});
      }
    });
  });
}
function UpdateBranch(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }
    let data = req.body.data || '';
    let updatebranchesquery = `UPDATE tbl_branch SET ? WHERE branch_id = ?`;
    conn.query(updatebranchesquery, [data, data.branch_id],(error, results) => {
      conn.release();
      if (error) {
        res.json({em});
      } else {
        res.json({success: true, response: 'Branch was successfully updated!'});
      }
    });
  });
}
function DeleteBranch(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }
    let data = req.body.data || '';
    let deletebranchesquery = `DELETE FROM tbl_branch WHERE branch_id = ?`;
    conn.query(deletebranchesquery, [data],(error, results) => {
      conn.release();
      if (error) {
        res.json({em});
      } else {
        res.json({success: true, response: 'Branch was successfully removed!'});
      }
    });
  });
}
/*----------------------------------
             Services
-----------------------------------*/

function GetServicesGroup(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }
    let getservicesgroupquery = `SELECT * FROM inf_service_group`;
    conn.query(getservicesgroupquery, (error, results) => {
      conn.release();
      if (error) {
        res.json({em});
      } else {
        res.json({success: true, response: results});
      }
    });
  });
}


function AddandUpdateServicesGroup(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }

    let data = req.body.data || '';
    let action = re.body.action || '';
    let id = re.body.id || '';
    let addservicesgroupquery = `INSERT INTO tbl_services_group SET ${data}`;
    let updateservicesgroupquery = `UPDATE FROM tbl_services_group SET  ${data} WHERE service_group_id =  ${id}`;
    let selected_query = action === 'add' ? addservicesgroupquery : updateservicesgroupquery;
    conn.query(selected_query, (error, results) => {
      conn.release();
      if (error) {
        res.json({em});
      } else {
        res.json({success: true, response: 'Service Group Successfully Added.'});
      }
    });
  });
}

function DeleteServicesGroup(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }

    let id = req.body.data || '';
    let deleteservicesgroupquery = `DELETE FROM tbl_service_group WHERE service_group_id = ?`
    conn.query(deleteservicesgroupquery, [id], (error, results) => {
      conn.release();
      if (error) {
        res.json({em});
      } else {
        res.json({success: true, response: 'Service Group Successfully Removed.'});
      }
    });
  });
}

function GetServices(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }
    let size = req.body.size || 10;
    let search = req.body.search || "";
    let index = req.body.index >= 0 ? req.body.index : 0;
    let getservicesquery;
    if(search){
      getservicesquery = `
      SELECT * FROM tbl_services a
        JOIN inf_service_group b ON a.service_group = b.service_group_id
        WHERE a.service_code LIKE '%${search}%' OR
        a.service_name LIKE '%${search}%' OR
        a.service_dur LIKE '%${search}%' OR
        b.service_group_name LIKE '%${search}%' OR
        a.service_price  LIKE '%${search}%'
        ORDER BY a.service_id ASC
        LIMIT ${size};
        SELECT COUNT(*) AS total_data FROM tbl_services;
      `;
    } else {
      getservicesquery = `
        SELECT * FROM tbl_services a
        JOIN inf_service_group b ON a.service_group = b.service_group_id
        ORDER BY a.service_id ASC
        LIMIT ${index}, ${size};
        SELECT COUNT(*) AS total_data FROM tbl_services;
      `;
    }
    conn.query(getservicesquery, (error, results) => {
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


function GetServiceByBranchId(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }
    let data = req.body.data || '';
    let getservicesbybranchidquery = `SELECT * FROM tbl_services WHERE branch_id = ?`;
    conn.query(getservicesbybranchidquery,[data], (error, results) => {
      conn.release();
      if (error) {
        res.json({em});
      } else {
        res.json({success: true, response: results});
      }
    });
  });
}


function GetServiceById(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }
    let data = req.body.data || '';
    let getservicesquery = `SELECT * FROM tbl_services a JOIN
        inf_service_group b ON a.service_group = b.service_group_id
        WHERE a.service_id = ?`;
    conn.query(getservicesquery,[data], (error, results) => {
      conn.release();
      if (error) {
        res.json({em});
      } else {
        res.json({success: true, response: results});
      }
    });
  });
}

function AddService(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }
    let data = req.body.data || '';
    let addserveicesquery = `INSERT INTO tbl_services SET ?`;
    conn.query(addserveicesquery,[data], (error, results) => {
      conn.release();
      if (error) {
        res.json({em});
      } else {
        res.json({success: true, response: 'Service Successfully Removed.'});
      }
    });
  });
}

function UpdateService(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }
    let id = req.body.data || '';
    let updateserveicesquery = `UPDATE tbl_services SET ? WHERE service_id = ?`;
    conn.query(updateserveicesquery,[id, id.service_id], (error, results) => {
      conn.release();
      if (error) {
        res.json({em});
      } else {
        res.json({success: true, response:  'Service Successfully Updated.'});
      }
    });
  });
}
function DeleteService(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }
    let id = req.body.data || '';
    let removeserveicesquery = `DELETE FROM tbl_services WHERE service_id = ?`;
    conn.query(removeserveicesquery,[id], (error, results) => {
      conn.release();
      if (error) {
        res.json({em});
      } else {
        res.json({success: true, response:  'Service Successfully Deleted.'});
      }
    });
  });
}


function GetAvailableServicesInformation(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }
    let date = req.body.date || '';
    let branch_id = req.body.id || '';
    let booked_date = moment(date).format("YYYY-MM-DD");
      let getbookeddatequery = `
        SELECT
        b.*,
        s.service_name,
        s.service_dur, 
        r.room_name,
        r.room_cat,
        r.room_pax,
        r.room_pax_status
        FROM tbl_bookings b 
        LEFT JOIN tbl_services s ON s.service_id = b.service_id
        LEFT JOIN inf_rooms r ON r.room_id = b.room_id
        WHERE CAST(b.booked_date AS DATE) = ? AND b.branch_id = ?
        `;
      conn.query(getbookeddatequery, [booked_date, branch_id], (error, results) => {
        conn.release();
        if (error) {
          res.json(em);
        } else {
          res.json({success: true, response: results});
        }
      });
  });
}

/*----------------------------------
             Rooms
-----------------------------------*/

function GetRooms(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }
    let size = req.body.size || 12;
    let search = req.body.search || "";
    let index = req.body.index >= 0 ? req.body.index : 0;
    let getroomsquery;
    if(index === -1){
      getroomsquery = `
              SELECT a.*, b.book_guest_name, b.time_start, b.service_id, c.service_name FROM inf_rooms a
              LEFT JOIN tbl_bookings b ON b.room_id = a.room_id
              LEFT JOIN tbl_services c ON c.service_id = b.service_id
              GROUP BY a.room_id
              ORDER BY a.room_id ASC`;
    } else {
      if(search){
        getroomsquery = `
          SELECT * FROM inf_rooms a
          WHERE a.room_name
          LIKE '%${search}%' OR
          a.room_cat LIKE '%${search}%' OR
          a.room_pax LIKE '%${search}%' OR
          a.room_status LIKE '%${search}%'
          ORDER BY a.room_id ASC
          LIMIT ${size};
          SELECT COUNT(*) AS total_data FROM inf_rooms;
        `;
      } else {
        getroomsquery = `
          SELECT a.*, b.book_guest_name, b.time_start, b.service_id, c.service_name FROM inf_rooms a
          LEFT JOIN tbl_bookings b ON b.room_id = a.room_id
          LEFT JOIN tbl_services c ON c.service_id = b.service_id
          GROUP BY a.room_id
          ORDER BY a.room_id ASC
          LIMIT ${index}, ${size};
          SELECT COUNT(*) AS total_data FROM inf_rooms;
        `;
      }
    }
    conn.query(getroomsquery, (error, results) => {
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

function GetAllRooms(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }
    let getallroomsquery = `SELECT * FROM inf_rooms`;    
    conn.query(getallroomsquery, (error, results) => {
      conn.release();
      if (error) {
        res.json({em});
      } else {
        res.json({success: true, response: results});
      }
    });
  });
}

function GetRoomByRoomId(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }
    let data = req.body.data || '';
    let getroombyroomidquery = `SELECT * FROM inf_rooms WHERE room_id = ?`;
    conn.query(getroombyroomidquery,[data], (error, results) => {
      conn.release();
      if (error) {
        res.json({em});
      } else {
        res.json({success: true, response: results});
      }
    });
  });
}

function AddRoom(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }
    let data = req.body.data || '';
    let addroomquery = `INSERT INTO inf_rooms SET ?`;
    conn.query(addroomquery,[data], (error, results) => {
      conn.release();
      if (error) {
        res.json({em});
      } else {
        res.json({success: true, response: 'Service Successfully Removed.'});
      }
    });
  });
}

function UpdateRoom(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }
    let id = req.body.data || '';
    let updateroomquery = `UPDATE inf_rooms SET ? WHERE room_id = ?`;
    conn.query(updateroomquery,[id, id.room_id], (error, results) => {
      conn.release();
      if (error) {
        res.json({em});
      } else {
        res.json({success: true, response:  'Service Successfully Updated.'});
      }
    });
  });
}
function DeleteRoom(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }
    let id = req.body.data || '';
    let roomremovequery = `DELETE FROM inf_rooms WHERE room_id = ?`;
    conn.query(roomremovequery,[id], (error, results) => {
      conn.release();
      if (error) {
        res.json({em});
      } else {
        res.json({success: true, response:  'Service Successfully Deleted.'});
      }
    });
  });
}

function GetExtraTime(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }
    let id = req.body.data || '';
    let roomremovequery = `SELECT et_time FROM inf_time WHERE branch_id = ?`;
    conn.query(roomremovequery,[id], (error, results) => {
      conn.release();
      if (error) {
        res.json({em});
      } else {
        res.json({success: true, response: results});
      }
    });
  });
}


/*----------------------------------
             Rooms Categories
-----------------------------------*/

function GetRoomsCategory(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }
    let data = req.body.data || '';
    let getromcategoryquery = `SELECT * FROM inf_room_cat`;
    conn.query(getromcategoryquery, (error, results) => {
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
    getNavs: GetNavs,
    getNavsWithPrivs: GetNavsWithPrivs,
    getDiscounts: GetDiscounts,
    addDiscount: AddDiscount,
    updateDiscount: UpdateDiscount,
    deleteDiscount: DeleteDiscount,
    getPrivs: GetPrivs,
    getPrivOfTheAccount: GetPrivOfTheAccount,
    updatePrivilegesSettings: UpdatePrivilegesSettings,
    getBranches: GetBranches,
    addBranch: AddBranch,
    updateBranch: UpdateBranch,
    deleteBranch: DeleteBranch,
    getServicesGroup: GetServicesGroup,
    getServices: GetServices,
    getServiceById: GetServiceById,
    getServiceByBranchId: GetServiceByBranchId,
    addService: AddService,
    updateService: UpdateService,
    deleteService: DeleteService,
    getAvailableServicesInformation: GetAvailableServicesInformation,
    addandUpdateServicesGroup: AddandUpdateServicesGroup,
    deleteServicesGroup: DeleteServicesGroup,
    getAllRooms: GetAllRooms,
    getRooms: GetRooms,
    getRoomByRoomId:GetRoomByRoomId,
    addRoom: AddRoom,
    updateRoom: UpdateRoom,
    deleteRoom: DeleteRoom,
    getPercentDiscount: GetPercentDiscount,
    getExtraTime: GetExtraTime,
    getRoomsCategory: GetRoomsCategory,
}
