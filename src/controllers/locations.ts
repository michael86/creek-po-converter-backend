import { RequestHandler } from "express";
import { insertLocation, selectAllLocations, setPartLocation } from "../queries/locations";

export const fetchAllLocations: RequestHandler = async (req, res) => {
  try {
    const locations = await selectAllLocations();
    if (!locations) throw new Error("locations was empty");

    if (!locations.length) {
      res.status(200).json({ status: "warning", message: "No locations fount." });
      return;
    }

    res.status(200).json({ status: "success", data: locations });
    return;
  } catch (error) {
    console.error("Error selecting all locations \n", error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
    return;
  }
};

export const updateLocation: RequestHandler = async (req, res) => {
  try {
    const { itemName, location } = req.body;

    const updated = await setPartLocation(itemName, location);
    if (typeof updated === "string") throw new Error(updated);

    if (!updated)
      throw new Error(
        `Updating location failed with null return value\npart id: ${itemName}\nLocation: ${location}`
      );

    res.status(200).json({ status: 1, message: "Location updated for part" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 0, message: "Internal Server Error" });
  }
};

export const addLocation: RequestHandler = async (req, res) => {
  try {
    const { location, amount } = req.body;
    await insertLocation(location, amount);
    res.status(200).json({ status: 1, message: "location added" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 0, message: "internal Server Error" });
  }
};
