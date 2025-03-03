// Get the client
import mysql from "mysql2/promise";

// Create the connection to database
const pool = mysql.createPool({
  host: process.env.SQL_URL || "localhost",
  user: process.env.SQL_USER || "root",
  database: process.env.SQL_NAME || "",
  port: Number(process.env.SQL_PORT) || 3306,
  password: process.env.SQL_PASS || "",
  connectionLimit: 50,
});

export const closeDBConnection = async () => {
  await pool.end();
};

export default pool;
