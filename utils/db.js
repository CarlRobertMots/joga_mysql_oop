const mysql = require('mysql2');

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "qwerty",
  database: "joga_mysql_oop"
});

const promisePool = pool.promise();

module.exports = promisePool;