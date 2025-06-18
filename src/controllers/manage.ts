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

export const updateRole: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  const { role } = req.body;

  // Here you would typically call a service or query to update the user's role
  // For now, we will just return a success message
  res.status(200).json({
    status: 1,
    message: `User with ID ${id} updated to role ${role}`,
  });
};
