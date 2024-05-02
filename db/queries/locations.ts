import { PutRequest } from "@types_sql/index";
import { runQuery } from "../connection";
import { SelectLocation, SelectLocationId, SelectPartLocationId } from "@types_sql/queries";

export const selectLocationIdForPart = async (order: number, part: number) => {
  try {
    const location = await runQuery<SelectPartLocationId>(
      `SELECT location FROM po_pn_location WHERE purchase_order = ? AND part_number = ?`,
      [order, part]
    );
    if ("code" in location)
      throw new Error(`Failed to select location id for order: ${order} \nPart: ${part}`);

    return +location[0]?.location;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const selectLocationId = async (location: string) => {
  try {
    const id = await runQuery<SelectLocationId>(
      `SELECT id FROM locations WHERE location = ?`,
      location
    );
    if ("code" in id)
      throw new Error(`Failed to select location id for ${location} \n${id.message}`);

    return +id[0].id;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const patchLocation = async (locationId: number, lineId: number) => {
  try {
    const res = await runQuery<PutRequest>(`UPDATE \`lines\` SET location_id = ? WHERE id = ?`, [
      locationId,
      lineId,
    ]);
    if ("code" in res) throw new Error(`Error patching line location ${res.message}`);
    return res.affectedRows;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const insertLocation = async (
  purchaseId: number,
  partId: number,
  location: number,
  query: string
) => {
  try {
    //DO NOT SWITCH THE QUERY VARS ORDER!!!!!
    const inserted = await runQuery<PutRequest>(query, [location, purchaseId, partId]);
    if ("code" in inserted)
      throw new Error(
        `Failed to insert id relation for ${purchaseId} \nError: ${inserted.message}`
      );

    return inserted.affectedRows;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const selectLocation = async (id: number) => {
  try {
    const res = await runQuery<SelectLocation>(`SELECT location FROM locations WHERE id = ?`, id);

    if ("code" in res) throw new Error(`Failed to select location ${res.message}`);

    return res[0].location;
  } catch (error) {
    console.error(error);
    return null;
  }
};
