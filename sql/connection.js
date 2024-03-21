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
require("dotenv").config();
const mysql = require("mysql");
const connection = mysql.createConnection({
    port: process.env.SQL_PORT,
    database: process.env.SQL_NAME,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASS,
    host: process.env.SQL_URL,
});
const createSqlConnection = () => {
    connection.connect(function (err) {
        if (err) {
            console.error("error connecting: " + err.stack);
            return;
        }
        console.log("connected as id " + connection.threadId);
    });
};
function asyncMySQL(query, vars) {
    return new Promise((resolve, reject) => {
        connection.query(query, vars, (error, results) => {
            if (error) {
                reject(error);
            }
            resolve(results);
        });
    });
}
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
        if (err.code !== "ER_DUP_ENTRY")
            return new Error(`${err.code}\n${err.sqlMessage}`);
        return err.code;
    }
});
module.exports = { createSqlConnection, runQuery };
