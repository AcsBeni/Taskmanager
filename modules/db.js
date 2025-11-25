var mysql = require('mysql');
var pool = mysql.createPool({
  host           : process.env.DBHOST,
  user           : process.env.DBUSER,
  password       : process.env.DBPASS,
  database       : process.env.DBNAME,
  connectionLimit: 10
});

pool.getConnection((err, connection) => {
  if (err) {
    console.log('Error connecting to the database:', err);
    return;
  }
    console.log('Connected to the database');
    
});

module.exports = pool;