import { RequestHandler } from "express";
import { selectAllLocations } from "../queries/locations";

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
