import { RequestHandler } from "express";
import { insertDeliveries } from "../queries/deliveries";

export const addDeliveryToOrder: RequestHandler = async (req, res) => {
  try {
    const { poNumber, deliveries, uuid, partNumber, date } = req.body;

    await insertDeliveries(poNumber, deliveries, uuid, partNumber, date);

    res.status(200).json({ status: 1, message: "Delivery added" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 0, message: "Internal Server Error" });
  }
};
