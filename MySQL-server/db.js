const mysql = require("mysql2");
const bcrypt = require("bcryptjs");

exports.pool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
  port: process.env.DATABASE_PORT,
});

// PASSWORD ENCRIPTING
exports.hashedPassword = async (password) => {
  return await bcrypt.hash(password, 12);
};

// PASSWORD COMPARING
exports.correctPassword = async (logPassword, dbPassword) => {
  return await bcrypt.compare(logPassword, dbPassword);
};
