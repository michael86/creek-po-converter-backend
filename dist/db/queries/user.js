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
exports.getUserRole = exports.updateUserToken = exports.setTokenToNull = exports.validateUserToken = exports.validateLogin = exports.createUser = exports.selectEmail = void 0;
const connection_1 = require("../connection");
const tokens_1 = require("../../utils/tokens");
/**
 *
 * Will return the total number of emails existing in the database that match a given string
 *
 * @param email string
 * @returns number
 */
const selectEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield (0, connection_1.runQuery)("select email from users where email = ?", [email]);
        if ("code" in res)
            throw new Error(`Error selecting users email: ${res.message}`);
        return res.length;
    }
    catch (error) {
        console.error(error);
        return;
    }
});
exports.selectEmail = selectEmail;
/**
 *
 * Will attempt to create a new user, as well as a token and the relevant relation
 *
 * @param email string
 * @param password  string
 * @returns void | string - string will be token for new user
 */
const createUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [user, token] = yield Promise.all([
            (0, connection_1.runQuery)("insert into users (email, password) values (?, ?)", [email, password]),
            (0, tokens_1.generateToken)(),
        ]);
        if ("code" in user || !token)
            throw new Error(`Error selecting users email: ${user.message}\n${token}`);
        const tokenId = yield (0, connection_1.runQuery)(`INSERT INTO tokens (token) VALUES (?)`, [token]);
        if ("code" in tokenId)
            throw new Error(`Failed to create new user (token insert) ${tokenId.message}`);
        const relation = yield (0, connection_1.runQuery)(`INSERT INTO user_token (user, token) VALUES (?, ? )`, [user.insertId, tokenId.insertId]);
        if ("code" in relation)
            throw new Error(`Failed to create user (user/token relation) ${relation.message}}`);
        return token;
    }
    catch (error) {
        console.error(error);
        return;
    }
});
exports.createUser = createUser;
/**
 *
 * will attempt to retrieve a users password and user id
 *
 * @param email string
 * @returns [password: string, userId: string] | void
 */
const validateLogin = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield (0, connection_1.runQuery)(`SELECT password, id FROM users WHERE email = ?`, email);
        console.log("res ", res);
        if ("code" in res)
            throw new Error(`Error valideLogin \n${res.message}`);
        return [res[0].password, res[0].id];
    }
    catch (error) {
        console.error("Validate login ", error);
        return;
    }
});
exports.validateLogin = validateLogin;
/**
 * Will attempt to compare the received token against the token stored for users email
 * @param email string
 * @param tokenReceived string
 * @returns boolean | void
 */
const validateUserToken = (email, tokenReceived) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, connection_1.runQuery)(`Select id from users Where email = ? `, [email]);
        if ("code" in user)
            throw new Error(`Failed to validate user token\nNo email for id ${user.message}`);
        const userTokenId = yield (0, connection_1.runQuery)(`select token from user_token where user = ?`, [user[0].id]);
        if ("code" in userTokenId)
            throw new Error(`Failed to validate user token\nNo token for user ${userTokenId.message}`);
        const token = yield (0, connection_1.runQuery)(`select token from tokens where id = ?`, [
            userTokenId[0].token,
        ]);
        if ("code" in token)
            throw new Error(`Failed to validate user token\nNo token for token id ${token.message}`);
        return tokenReceived === token[0].token;
    }
    catch (error) {
        console.error("Failed to validate User Token ", error);
        return;
    }
});
exports.validateUserToken = validateUserToken;
/**
 *
 * Will attempt to set a usders token to null, typically used for logging a user out
 *
 * @param email string
 * @param tokenReceived string
 * @returns void | true
 */
const setTokenToNull = (email, tokenReceived) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = yield (0, connection_1.runQuery)(`SELECT id from users where email = ?`, [email]);
        if ("code" in userId)
            throw new Error(`Failed to set token to null\ncouldn't select user id for email ${userId.message}`);
        const relation = yield (0, connection_1.runQuery)(`select token from user_token where user = ?`, userId[0].id);
        if ("code" in relation)
            throw new Error(`Failed to set token to null\ncouldn't select token id for user id ${relation.message}`);
        const token = yield (0, connection_1.runQuery)(`select token from tokens where id = ?`, [
            relation[0].token,
        ]);
        if ("code" in token)
            throw new Error(`Failed to set token to null\ncouldn't select token for token id ${token.message}`);
        if (token[0].token !== tokenReceived)
            return;
        const tokenRemoved = yield (0, connection_1.runQuery)(`UPDATE tokens SET token = null WHERE id = ?`, relation[0].token);
        if ("code" in tokenRemoved)
            throw new Error(`Failed to set token to null ${tokenRemoved.message}`);
        return true;
    }
    catch (error) {
        console.error(`Failed to log out user: ${error}`);
        return;
    }
});
exports.setTokenToNull = setTokenToNull;
/**
 *
 * Will attempt to update a users token
 *
 * @param email string
 * @param token string
 * @returns true | void
 */
const updateUserToken = (email, token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = yield (0, connection_1.runQuery)(`SELECT id from users where email = ?`, [email]);
        if ("code" in userId)
            throw new Error(`Failed to update user Token\nCouldn't select user id ${userId.message}`);
        const relation = yield (0, connection_1.runQuery)(`select token from user_token where user = ?`, userId[0].id);
        if ("code" in relation)
            throw new Error(`Failed to update user Token\nCouldn't select token relation ${relation.message}`);
        const res = yield (0, connection_1.runQuery)(`update tokens set token = ? where id = ?`, [
            token,
            relation[0].token,
        ]);
        if ("code" in res)
            throw new Error(`Failed to update user Token ${res.message}`);
        return true;
    }
    catch (error) {
        console.error(error);
        return;
    }
});
exports.updateUserToken = updateUserToken;
/**
 *
 * Will get the users current role status
 *
 * @param email string
 * @returns number | void
 */
const getUserRole = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const role = yield (0, connection_1.runQuery)("select role from users where email =? ", [email]);
        if ("code" in role)
            throw new Error(`error fetching prefixes \n${role}`);
        return +role[0].role;
    }
    catch (error) {
        console.error(error);
        return;
    }
});
exports.getUserRole = getUserRole;
