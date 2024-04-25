import { getUserId } from "../db/queries/user";
import { insertNewLog } from "../db/queries/logs";
import { Request, Response, NextFunction } from "express";
import { Log } from "types/generic";
import { sanitizeToHtmlEntities } from "../utils";

export function addLog(log: Log) {
  return async function (req: Request, res: Response, next: NextFunction) {
    let { email } = req.headers;
    if (!email || !email.length) {
      email = req.body.email || req.body.data.email;
    }

    if (!email) return res.status(400).send();

    const userId = await getUserId(<string>email);
    if (!userId) return res.status(400).send();

    let message = "";
    switch (log) {
      case "login":
        message = "User logged in";
      case "logout":
        message = "User logged out";
      case "validateToken":
        message = "User validated there token";
        break;
      case "updateLocation":
        let { order, part, location } = req.body;
        order = sanitizeToHtmlEntities(order);
        part = sanitizeToHtmlEntities(part);
        location = sanitizeToHtmlEntities(location);
        message = `user updated location for ${part} on order ${order} to ${location}`;
        break;

      case "isPrefixValid":
        const { prefix } = req.params;
        message = `User checked if ${sanitizeToHtmlEntities(prefix)} was valid`;
        break;
      case "addPrefix":
        const p = req.body.prefix;
        message = `User added prefix ${sanitizeToHtmlEntities(p)}`;

        break;
      default:
        break;
    }

    const rel = await insertNewLog(userId, <string>email, message);
    if (!rel) return res.status(400).send();
    next();
  };
}
