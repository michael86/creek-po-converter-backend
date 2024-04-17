require("dotenv").config();
const mysql = require("mysql");

const pool = mysql.createPool({
  connectionLimit: 10,
  port: process.env.SQL_PORT,
  database: process.env.SQL_NAME,
  user: "root",
  password: "",
  host: process.env.SQL_URL,
});

const createSqlConnection = () => {
  pool.getConnection(function (err: Error, connection: any) {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`Database started and connected as ${connection.threadId}\nReleasing connection`);
    connection.destroy();
  });
};

function asyncMySQL(query: string, vars: (string | number)[]) {
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err: Error, connection: any) {
      if (err) throw err;

      connection.query(query, vars, (error: Error, results: any) => {
        if (error) {
          reject(error);
        }
        resolve(results);

        //REturn the connection to the pool
        connection.destroy();
      });
    });
  });
}

const runQuery = async (query: string, data: (string | number)[]) => {
  try {
    for (let i = 0; i <= data.length; i++) {
      //Because of the way for loops work, we have to create a new variable to hold the true typeof data[i]
      //https://stackoverflow.com/questions/75640224/type-narrowing-is-not-working-in-for-loop
      const d = data[i];
      if (d === "string") {
        data[i] = d.toLowerCase();
      }
    }

    return await asyncMySQL(query, data);
  } catch (err: any) {
    if (err.code !== "ER_DUP_ENTRY") return new Error(`${err.code}\n${err.sqlMessage}`);

    return err.code;
  }
};

module.exports = { createSqlConnection, runQuery };
