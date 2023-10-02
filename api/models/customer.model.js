const pool = require("../utils/mysql-connection");
let em = {message: 'Please try again later', code: 503, status: 'Empty Response'};


function SearchCustomer(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }
    let size = req.body.size || 10;
    let search = req.body.search || "";
    let index = req.body.index >= 0 ? req.body.index : 0;
    let getCustomerQuery;
    if(search.length > 0){
      getCustomerQuery = `
              SELECT * FROM tbl_customers a
              LEFT JOIN inf_customer_status b ON a.cus_cat_id = b.cus_cat_id
              WHERE deleted = 0 AND
              a.cus_name LIKE '${search}%'OR
              a.cus_no LIKE '${search}%' OR
              b.cus_cat_name LIKE '${search}%' OR
              a.cus_note LIKE '${search}%'
              ORDER BY a.cus_name
              LIMIT ${size};
              SELECT COUNT(*) as total FROM tbl_customers WHERE deleted = 0 ;
            `;
    } else {
      getCustomerQuery =`SELECT * FROM tbl_customers WHERE deleted = 0
                        LIMIT ${index},${size};
                        SELECT COUNT(*) as total FROM tbl_customers WHERE deleted = 0 ;`
    }
    conn.query(getCustomerQuery, (error, results) => {
      conn.release();
      if (error) {
        res.json({em});
      } else {
        if(results.length > 0){
          res.json({success: true, response: results[0], length: results[1][0].total});
        } else {
          res.json({success: false, response: [], length: 0});
        }
      }
    });
  });
}



function SearchCustomerCategory(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }
    let search = req.body.search || "";
    let getCustomerQuery = `
              SELECT * FROM inf_customer_status WHERE
              cus_cat_name LIKE '${search}%'OR
              cus_cat_desc LIKE '${search}%'
              ORDER BY cus_cat_name DESC
            `;
    conn.query(getCustomerQuery, (error, results) => {
      conn.release();
      if (error) {
        res.json({em});
      } else {
        if(results.length > 0){
          res.json({success: true, response: results});
        } else {
          res.json({success: false, response: [], length: 0});
        }
      }
    });
  });
}


function GetCustomers(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }
    let getCustomerQuery = `SELECT * FROM tbl_customers WHERE deleted = 0`;
    conn.query(getCustomerQuery, (error, results) => {
      conn.release();
      if (error) {
        res.json({em});
      } else {
        res.json({success: true, response: results});
      }
    });
  });
}


function GetCustomersCategories(req, res) {
    pool.getConnection((error, conn) => {
      if (error) {
        if (conn) conn.release();
        res.json({code: 100, status: "Error in connecting to the database"});
        return;
      }
      let getCustomerCatQuery = `SELECT * FROM inf_customer_status`;
      conn.query(getCustomerCatQuery, (error, results) => {
        conn.release();
        if (error) {
          res.json({em});
        } else {
          res.json({success: true, response: results});
        }
      });
    });
  }

  function AddCustomerCategories(req, res) {
      pool.getConnection((error, conn) => {
        if (error) {
          if (conn) conn.release();
          res.json({code: 100, status: "Error in connecting to the database"});
          return;
        }
        let data = req.body.data || '';
        let addCustomerQuery = `INSERT INTO inf_customer_status SET ?`;
        conn.query(addCustomerQuery, [data], (error, results) => {
          conn.release();
          if (error) {
              res.json({em});
          } else {
              res.json({success: true, response: results});
          }
        });
      });
  }
  


function AddCustomer(req, res) {
    pool.getConnection((error, conn) => {
      if (error) {
        if (conn) conn.release();
        res.json({code: 100, status: "Error in connecting to the database"});
        return;
      }
      let data = req.body.data || '';
      let addCustomerQuery = `INSERT INTO tbl_customers SET ?`;
      conn.query(addCustomerQuery, [data], (error, results) => {
        conn.release();
        if (error) {
            res.json({em});
        } else {
            res.json({success: true, response: results});
        }
      });
    });
}

function UpdateCustomer(req, res) {
    pool.getConnection((error, conn) => {
      if (error) {
        if (conn) conn.release();
        res.json({code: 100, status: "Error in connecting to the database"});
        return;
      }
      let data = req.body.data || '';
      let id = req.body.id || '';
      let updateCustomerQuery = `UPDATE tbl_customers SET ? WHERE cus_id = ?`;
      conn.query(updateCustomerQuery, [data, id], (error, results) => {
        conn.release();
        if (error) {
          res.json({em});
        } else {
          res.json({success: true, response: 'Member Successfully Updated'});
        }
      });
    });
}


function UpdateCustomerCategories(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }
    let data = req.body.data || '';
    let id = req.body.id || '';
    let updateCustomerQuery = `UPDATE inf_customer_status SET ? WHERE cus_cat_id = ?`;
    conn.query(updateCustomerQuery, [data, id], (error, results) => {
      conn.release();
      if (error) {
        res.json({em});
      } else {
        res.json({success: true, response: 'Category Successfully Updated'});
      }
    });
  });
}
function RemoveCustomerCategories(req, res) {
  pool.getConnection((error, conn) => {
    if (error) {
      if (conn) conn.release();
      res.json({code: 100, status: "Error in connecting to the database"});
      return;
    }
    let id = req.body.id || '';
    let deleteCustomerQuery = `DELETE FROM inf_customer_status WHERE cus_cat_id = ?`;
    conn.query(deleteCustomerQuery, [id], (error, results) => {
      conn.release();
      console.log(id);
      console.log(deleteCustomerQuery);
      if (error) {
        res.json({em});
      } else {
        res.json({success: true, response: 'Category Successfully Removed'});
      }
    });
  });
}
  


module.exports = {
    searchCustomer: SearchCustomer,
    searchCustomerCategory: SearchCustomerCategory,
    getCustomers: GetCustomers,
    addCustomer: AddCustomer,
    updateCustomer: UpdateCustomer,
    getCustomersCategories: GetCustomersCategories,
    addCustomerCategories: AddCustomerCategories,
    updateCustomerCategories: UpdateCustomerCategories,
    removeCustomerCategories: RemoveCustomerCategories,
};
