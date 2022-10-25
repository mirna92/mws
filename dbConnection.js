var mysql = require('mysql2');
var conn = mysql.createConnection({
  host: 'sql.freedb.tech', // Replace with your host name
  user: 'freedb_root_remote',      // Replace with your database username
  password: 'u6yp!jxdgw8M$?W',      // Replace with your database password
  database: 'freedb_MWS_HW' // // Replace with your database Name
}); 
 
conn.connect(function(err) {
  if (err) throw err;
  console.log('Database is connected successfully !');
});
module.exports = conn;