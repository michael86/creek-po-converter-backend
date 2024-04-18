"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runQuery = exports.createSqlConnection = void 0;
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
    pool.getConnection(function (err, connection) {
        if (err) {
            console.error(err);
            return;
        }
        console.log(`Database started and connected as ${connection.threadId}\nReleasing connection`);
        connection.destroy();
    });
};
exports.createSqlConnection = createSqlConnection;
const asyncMySQL = (query, vars) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err)
                throw err;
            connection.query(query, vars, (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }
                console.log("results ", results);
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
const runQuery = (query, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        for (let i = 0; i <= data.length; i++) {
            //Because of the way for loops work, we have to create a new variable to hold the true typeof data[i]
            //https://stackoverflow.com/questions/75640224/type-narrowing-is-not-working-in-for-loop
            const d = data[i];
            if (d === "string") {
                data[i] = d.toLowerCase();
            }
        }
        return yield asyncMySQL(query, data);
    }
    catch (err) {
        const mysqlError = err;
        if (mysqlError.code !== "ER_DUP_ENTRY") {
            console.error(`${mysqlError.code}\n${mysqlError.sqlMessage}`);
        }
        return mysqlError;
    }
});
exports.runQuery = runQuery;
module.exports = { createSqlConnection: exports.createSqlConnection, runQuery: exports.runQuery };
