import { RequestHandler } from "express";
import { selectUsers } from "../queries/manage";

export const getUsers: RequestHandler = async (req, res, next) => {
  try {
    const users = await selectUsers();

    res.status(200).json({
      status: 1,
      message: "Manage route is active",
      data: {
        users,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: "An error occurred while fetching users",
      error: JSON.stringify(error),
    });
  }
};
