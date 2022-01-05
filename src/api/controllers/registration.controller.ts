import * as crypto from "crypto";
import api from "../clients/nearapp.client";
import { Request, Response } from "express";

import registrationSchema from "../validations/registration.schema";
import User, { USER_STATUS } from "../../db/user.model";
import RegistrationDTO from "../interfaces/registrationDTO.interface";
import CreateNearWalletDTO from "../interfaces/nearApi/CreateNearWalletDTO.interface";

export const registration = async function (req, res) {
  const registrationDTO: RegistrationDTO = req.body;

  try {
    await registrationSchema.validate(req.body);
  } catch (err) {
    console.info({ err });
    return res.status(500).json({ type: err.name, message: err.message });
  }

  try {
    // Check if user already exists
    const existingUser = await User.scan(
      registrationDTO.type === "EMAIL"
        ? { email: registrationDTO.email }
        : { phone: registrationDTO.phone }
    ).exec();
    if (existingUser.count > 0) {
      return res.status(409).json({
        type: "UserAlreadyExists",
        message: "user with email/phone already exists",
      });
    }

    // Create user in DB
    const newUser = await User.create({
      id: crypto.randomUUID(),
      type: registrationDTO.type,
      email: registrationDTO.type === "EMAIL" ? registrationDTO.email : "",
      phone: registrationDTO.type === "PHONE" ? registrationDTO.phone : "",
      status: USER_STATUS.NONE_CREATED,
    });
    if (!newUser) {
      return res.status(500).json({ error: "Could not create user" });
    }

    // Creating a new user on the near network
    const newNearAccount: CreateNearWalletDTO = {
      fullName: registrationDTO.fullName,
      walletName: registrationDTO.walletName,
      email: registrationDTO.email,
      phone: registrationDTO.phone,
    };
    const newSession = await api.createUserAccount(newNearAccount);

    // Add wallet to list of wallets in our db
    newUser.wallets.push({ walletName: newUser.walletName });
    newUser.status = USER_STATUS.ACCOUNT_CREATED;
    User.update({ id: newUser.id }, newUser);

    // return id, status and new session (jwtAccessToken, jwtIdToken, jwtRefreshToken)
    res.json({
      id: newUser.id,
      status: newUser.status,
      token: newSession.jwtAccessToken,
      refreshToken: newSession.jwtRefreshToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not create user" });
  }
};

export const checkExistence = async function (req: Request, res: Response) {
  console.info({ query: req.query });
  const { type, email, phone } = req.query;

  try {
    const existingUser = await User.scan(
      type === "EMAIL" ? { email } : { phone }
    ).exec();
    if (existingUser.count > 0) {
      return res.status(200).json({
        exits: true,
      });
    }
    return res.status(409).json({
      exits: false,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not create user" });
  }
};
