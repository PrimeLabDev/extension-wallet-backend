import { Request, Response } from "express";
import api from "../clients/nearapp.client";
import User from "../../db/user.model";
export default class UserController {
  static async getDetails(req: Request, res: Response) {
    const { user_id } = req.body;
    try {
      const nearAppsUser = await api.getUserDetails(user_id);
      const user = await User.get(user_id);
      res.json({
        ...nearAppsUser,
        ...user,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Could not get user details" });
    }
  }
}
