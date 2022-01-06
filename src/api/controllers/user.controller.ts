import * as crypto from "crypto";
import api from "../clients/nearapp.client";
import { Request, Response } from "express";

import registrationSchema from "../validations/registration.schema";
import User, { USER_STATUS } from "../../db/user.model";
import {
  RegistrationRequestDTO,
  UserVerificationRequestDTO,
  UserCheckExistenceRequestDTO,
  UserLoginRequestDTO,
} from "../interfaces/user.interface";

export const registration = async function (req, res) {
  const registrationDTO: RegistrationRequestDTO = req.body;

  try {
    await registrationSchema.validate(req.body);
  } catch (err) {
    console.info({ err });
    return res.status(500).json({ type: err.name, message: err.message });
  }

  try {
    // Creating a new user on the near network
    const newSession = await api.createUserAccount({
      fullName: registrationDTO.fullName,
      walletName: registrationDTO.walletName,
      email: registrationDTO.email,
      phone: registrationDTO.phone,
    });

    // Create user in DB
    const newUser = await User.create({
      id: crypto.randomUUID(),
      type: registrationDTO.mode,
      email: registrationDTO.mode === "email" ? registrationDTO.email : "",
      phone: registrationDTO.mode === "phone" ? registrationDTO.phone : "",
      status: USER_STATUS.PENDING_VERIFICATION,
      wallets: [{ account_id: registrationDTO.walletName }],
    });

    if (!newUser) {
      return res.status(500).json({ error: "Could not create user" });
    }

    // return id, status and new session (jwtAccessToken, jwtIdToken, jwtRefreshToken, user_info)
    res.json({
      id: newUser.id,
      status: newUser.status,
      ...newSession,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not create user" });
  }
};

export const checkExistense = async function (req, res) {
  const { email, phone, mode }: UserCheckExistenceRequestDTO = req.body;

  try {
    const existingUser = await User.scan(
      mode === "email" ? { email: email } : { phone: phone }
    ).exec();
    console.info({ existingUser });

    res.status(200).json({ exists: existingUser?.count > 0 });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not verify user" });
  }
};

export const verifyUser = async function (req, res) {
  const { account_id, code }: UserVerificationRequestDTO = req.body;

  if (!account_id || !code) {
    return res.status(400).json({ type: "MISSING_PARAMETERS" });
  }

  try {
    const verifiedUser = await api.verifyUser({
      account_id,
      code,
    });

    return res.status(200).json(verifiedUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not verify user" });
  }
};

export const loginUser = async function (req, res) {
  const { phone, email, mode }: UserLoginRequestDTO = req.body;

  // try {
  //   const existingUser: any = await User.scan(
  //     mode === "email" ? { email } : { phone }
  //   ).exec();
  //   if (!existingUser) {
  //     const newUser = await User.create({
  //       id: crypto.randomUUID(),
  //       type: mode,
  //       email: mode === "email" ? email : "",
  //       phone: mode === "phone" ? phone : "",
  //       status: USER_STATUS.NO_WALLET,
  //     });

  //     if (!newUser) {
  //       res.status(500).json({ error: "Could not create user" });
  //     }

  //     const loginResponse = await api.loginUserWithWallet({
  //       ...(mode === "email" ? { email } : { phone }),
  //       mode,
  //     });
  //     if (!loginResponse) {
  //       res.status(500).json({ error: "Could not login user" });
  //     }

  //     if (loginResponse.success) {
  //       newUser.status = USER_STATUS.PENDING_VERIFICATION;
  //       User.update({ id: newUser.id }, newUser);
  //     }

  //     return res.status(200, {
  //       id: newUser.id,
  //       status: newUser.status,
  //       exists: loggedinUser.success,
  //       message: loggedinUser.message,
  //       account_id: loggedinUser.account_id,
  //     });
  //   }

  //   return res.status(200, {
  //     id: existingUser.id,
  //     status: existingUser.status,
  //     account_id: existingUser.wallets[0].account_id,
  //     exists: true,
  //   });
  // } catch (error) {
  //   console.log(error);
  //   res.status(500).json({ error: "Could not login user" });
  // }
};

export const getDetails = async (req: Request, res: Response) => {
  const { user_id } = req.params;
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