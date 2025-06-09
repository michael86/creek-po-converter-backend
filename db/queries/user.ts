import { FecthRequest, GetUserRole, PutRequest } from "@types_sql/index";
import {
  CreateUser,
  SelectEmail,
  SetTokenToNull,
  UpdateUserToken,
  ValidateLogin,
  ValidateUserToken,
  SelectUserId,
} from "@types_sql/queries";
import { runQuery } from "../connection";
import { generateToken } from "../../utils/tokens";

/**
 *
 * Will return the total number of emails existing in the database that match a given string
 *
 * @param email string
 * @returns number
 */
export const selectEmail: SelectEmail = async (email: string) => {
  try {
    const res = await runQuery<FecthRequest>("select email from users where email = ?", [email]);
    if ("code" in res) throw new Error(`Error selecting users email: ${res.message}`);
    return res.length;
  } catch (error) {
    console.error(error);
    return;
  }
};

/**
 * Will return the users id for a given email
 * @param email {string} users email
 * @returns void | number
 */
export const getUserId = async (email: string) => {
  try {
    const res = await runQuery<SelectUserId>(`SELECT id from users WHERE email = ?`, email);
    if ("code" in res) throw new Error(`Failed to select user id for ${email} \n${res.message}`);
    if (!res.length) return;
    return +res[0].id;
  } catch (error) {
    console.error(error);
    return;
  }
};

/**
 *
 * Will attempt to create a new user, as well as a token and the relevant relation
 *
 * @param email string
 * @param password  string
 * @returns void | string - string will be token for new user
 */
export const createUser: CreateUser = async (email: string, password: string) => {
  try {
    const [user, token] = await Promise.all([
      runQuery<PutRequest>("insert into users (email, password, role) values (?, ?, 2)", [
        email,
        password,
      ]),
      generateToken(),
    ]);

    if ("code" in user || !token)
      throw new Error(`Error selecting users email: ${user.message}\n${token}`);

    const tokenId = await runQuery<PutRequest>(`INSERT INTO tokens (token) VALUES (?)`, [token]);
    if ("code" in tokenId)
      throw new Error(`Failed to create new user (token insert) ${tokenId.message}`);

    const relation = await runQuery<PutRequest>(
      `INSERT INTO user_token (user, token) VALUES (?, ? )`,
      [user.insertId, tokenId.insertId]
    );

    if ("code" in relation)
      throw new Error(`Failed to create user (user/token relation) ${relation.message}}`);

    return token;
  } catch (error) {
    console.error(error);
    return;
  }
};

/**
 *
 * will attempt to retrieve a users password and user id
 *
 * @param email string
 * @returns [password: string, userId: string] | void
 */
export const validateLogin: ValidateLogin = async (email: string) => {
  try {
    const res = await runQuery<FecthRequest>(
      `SELECT password, id FROM users WHERE email = ?`,
      email
    );

    if ("code" in res) throw new Error(`Error valideLogin \n${res.message}`);
    if (!res[0]) return;
    return [res[0].password, res[0].id];
  } catch (error) {
    console.error("Validate login ", error);
    return;
  }
};

/**
 * Will attempt to compare the received token against the token stored for users email
 * @param email string
 * @param tokenReceived string
 * @returns boolean | void
 */
export const validateUserToken: ValidateUserToken = async (
  email: string,
  tokenReceived: string
) => {
  try {
    const user = await runQuery<FecthRequest>(`Select id from users Where email = ? `, [email]);
    if ("code" in user)
      throw new Error(`Failed to validate user token\nNo email for id ${user.message}`);

    const userTokenId = await runQuery<FecthRequest>(
      `select token from user_token where user = ?`,
      [user[0].id]
    );
    if ("code" in userTokenId)
      throw new Error(`Failed to validate user token\nNo token for user ${userTokenId.message}`);

    const token = await runQuery<FecthRequest>(`select token from tokens where id = ?`, [
      userTokenId[0].token,
    ]);
    if ("code" in token)
      throw new Error(`Failed to validate user token\nNo token for token id ${token.message}`);

    return tokenReceived === token[0].token;
  } catch (error) {
    console.error("Failed to validate User Token ", error);
    return;
  }
};

/**
 *
 * Will attempt to set a usders token to null, typically used for logging a user out
 *
 * @param email string
 * @param tokenReceived string
 * @returns void | true
 */
export const setTokenToNull: SetTokenToNull = async (email: string, tokenReceived: string) => {
  try {
    const userId = await runQuery<FecthRequest>(`SELECT id from users where email = ?`, [email]);

    if ("code" in userId)
      throw new Error(
        `Failed to set token to null\ncouldn't select user id for email ${userId.message}`
      );

    const relation = await runQuery<FecthRequest>(
      `select token from user_token where user = ?`,
      userId[0].id
    );
    if ("code" in relation)
      throw new Error(
        `Failed to set token to null\ncouldn't select token id for user id ${relation.message}`
      );

    const token = await runQuery<FecthRequest>(`select token from tokens where id = ?`, [
      relation[0].token,
    ]);
    if ("code" in token)
      throw new Error(
        `Failed to set token to null\ncouldn't select token for token id ${token.message}`
      );

    if (token[0].token !== tokenReceived) return;

    const tokenRemoved = await runQuery<PutRequest>(
      `UPDATE tokens SET token = null WHERE id = ?`,
      relation[0].token
    );

    if ("code" in tokenRemoved)
      throw new Error(`Failed to set token to null ${tokenRemoved.message}`);

    return true;
  } catch (error) {
    console.error(`Failed to log out user: ${error}`);
    return;
  }
};

/**
 *
 * Will attempt to update a users token
 *
 * @param email string
 * @param token string
 * @returns true | void
 */
export const updateUserToken: UpdateUserToken = async (email: string, token: string) => {
  try {
    const userId = await runQuery<FecthRequest>(`SELECT id from users where email = ?`, [email]);
    if ("code" in userId)
      throw new Error(`Failed to update user Token\nCouldn't select user id ${userId.message}`);

    const relation = await runQuery<FecthRequest>(
      `select token from user_token where user = ?`,
      userId[0].id
    );
    if ("code" in relation)
      throw new Error(
        `Failed to update user Token\nCouldn't select token relation ${relation.message}`
      );

    const res = await runQuery<PutRequest>(`update tokens set token = ? where id = ?`, [
      token,
      relation[0].token,
    ]);

    if ("code" in res) throw new Error(`Failed to update user Token ${res.message}`);

    return true;
  } catch (error) {
    console.error(error);
    return;
  }
};

/**
 *
 * Will get the users current role status
 *
 * @param email string
 * @returns number | void
 */

export const getUserRole: GetUserRole = async (email: string) => {
  try {
    const role = await runQuery<FecthRequest>("select role from users where email =? ", [email]);
    if ("code" in role) throw new Error(`error fetching prefixes \n${role}`);

    return +role[0].role;
  } catch (error) {
    console.error(error);
    return;
  }
};
