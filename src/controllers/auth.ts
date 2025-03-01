import { selectUserByEmail } from "../queries/users";
import { MeRequestRoute } from "../types/auth";

export const handleMe: MeRequestRoute = async (req, res) => {
  try {
    if (!req.user) {
      res.status(401).json({ status: "error", message: "Unauthorized: User not authenticated" });
      return;
    }

    const { email } = req.user;
    const user = await selectUserByEmail(email);

    if (!user) {
      res.status(404).json({ status: "error", message: `User not found for email ${email}` });
      return;
    }

    res.status(200).json({
      status: "success",
      message: "Token valid",
      data: { email, name: user.name },
    });
  } catch (error) {
    console.error("Error in handleMe:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
