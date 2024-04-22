import { MysqlError, Pool } from "mysql";
import { AsyncMySql } from "../types/sql";

require("dotenv").config();
const mysql = require("mysql");

const pool: Pool = mysql.createPool({
  connectionLimit: 10,
  port: process.env.SQL_PORT,
  database: process.env.SQL_NAME,
  user: "root",
  password: "",
  host: process.env.SQL_URL,
});

export const createSqlConnection = () => {
  pool.getConnection(function (err: Error, connection: any) {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`Database started and connected as ${connection.threadId}\nReleasing connection`);
    connection.destroy();
  });
};

const asyncMySQL: AsyncMySql = (query, vars) => {
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) throw err;

      connection.query(query, vars, (error, results) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(results);

        //REturn the connection to the pool
        connection.release();
      });
    });
  });
};

/**
 *
 * A wrapper for the asyncMySQl function, will manipulate the varibal param before using in the query
 *
 * @param query string - Sql query for manipulating database
 * @param data string | string[] - variables to be used for manipulating database
 * @returns will return an error or the relevant data based on what type of request was used
 */
export const runQuery: AsyncMySql = async (query, data) => {
  try {
    if (Array.isArray(data)) {
      for (let i = 0; i <= data.length; i++) {
        //Because of the way for loops work, we have to create a new variable to hold the true typeof data[i]
        //https://stackoverflow.com/questions/75640224/type-narrowing-is-not-working-in-for-loop
        const d = data[i];
        if (d === "string") {
          data[i] = d.toLowerCase();
        }
      }
    }

    return await asyncMySQL(query, data);
  } catch (err) {
    const mysqlError = err as MysqlError;
    if (mysqlError.code !== "ER_DUP_ENTRY") {
      console.error(`${mysqlError.code}\n${mysqlError.sqlMessage}`);
    }
    return mysqlError;
  }
};

module.exports = { createSqlConnection, runQuery };
