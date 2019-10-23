const mysql = require('mysql');

const db = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: process.env.USER_DB || 'root',
	password: process.env.PASSWORD_DB || '',
	database: process.env.DB_NAME || 'My_Notes_v1'
});

module.exports = db;