const mysql = require('mysql2');

const connection = mysql.createConnection(
    {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'employee_db',
    },
    console.log(`Connected to the employee_db`)
);

connection.connect();

module.exports = connection;
