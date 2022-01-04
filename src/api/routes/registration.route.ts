import * as crypto from "crypto";
import * as express from "express";

import ValidateRequestMiddleware from "../middlewares/validateRequest.middleware";
import registrationSchema from "../validations/registration.schema";
import User, { USER_STATUS } from "../../db/user.model";
// import api from "../clients/nearapp.client";
import { NearApiUser } from "../interfaces/nearApi.interface";

var router = express.Router();

router.post(
  "/registration",
  ValidateRequestMiddleware(registrationSchema),
  async function (req, res) {
    const { type, email, phone } = req.body;

    let user = {
      id: crypto.randomUUID(),
      type,
      email: type === "EMAIL" ? email : "",
      phone: type === "PHONE" ? phone : "",
      status: USER_STATUS.PENDING_VERIFICATION,
    };

    try {
      const query = type === "EMAIL" ? { email } : { phone };
      const existingUser = await User.scan({ ...query }).exec();
      if (existingUser.count > 0) {
        return res.status(409).json({
          type: "UserAlreadyExists",
          message: "user with email/phone already exists",
        });
      }
      const newUser = await User.create(user);

      // const nearAccount: NearApiUser = {
      //   operation: "create_user",
      //   args: {
      //     email: newUser.email,
      //     phone: newUser.phone,
      //     account_id: newUser.id,
      //   },
      // };

      // const newNearAccount = api.createUserAccount(nearAccount);

      res.json(newUser);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Could not create user" });
    }
  }
);

module.exports = router;
