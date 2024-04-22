import { FetchPrefixes, InsertPrefix } from "@types_sql/queries";
import { runQuery } from "db/connection";
import { FecthRequest, PutRequest } from "@types_sql/index";

export const fetchPrefixes: FetchPrefixes = async () => {
  try {
    const prefixes = await runQuery<FecthRequest>(`select prefix from prefixes`, []);
    if ("code" in prefixes) throw new Error(`error fetching prefixes \n${prefixes}`);
    return prefixes.map((entry) => entry.prefix);
  } catch (error) {
    console.error(error);
  }
};

export const insertPrefix: InsertPrefix = async (prefix: string) => {
  try {
    const res = await runQuery<PutRequest>(`insert into prefixes (prefix) values (?)`, [prefix]);
    if ("code" in res) throw new Error(`error fetching prefixes \n${res}`);

    return true;
  } catch (error) {
    console.error(`error inserting prefix ${error}`);
    return;
  }
};
