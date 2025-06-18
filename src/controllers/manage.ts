import { RequestHandler } from "express";
import { selectUsers, updateUserRole } from "../queries/manage";
import { stat } from "fs";

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

export const updateRole: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  const { role } = req.body;

  try {
    await updateUserRole(Number(id), Number(role));

    res.status(200).json({
      status: 1,
      message: `User with ID ${id} updated to role ${role}`,
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({
      status: 0,
      message: "Internal server error",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
