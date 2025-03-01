// Get the client
import mysql from "mysql2/promise";

console.log("host: ", process.env.SQL_URL);
console.log("user: ", process.env.SQL_USER);
console.log("database: ", process.env.SQL_NAME);
console.log("port: ", Number(process.env.SQL_PORT));
console.log("password: ", process.env.SQL_PASS);

// Create the connection to database
const pool = mysql.createPool({
  host: process.env.SQL_URL || "localhost",
  user: process.env.SQL_USER || "root",
  database: process.env.SQL_NAME || "",
  port: Number(process.env.SQL_PORT) || 3306,
  password: process.env.SQL_PASS || "",
  connectionLimit: 50,
});

export default pool;
