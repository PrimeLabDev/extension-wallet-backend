import * as crypto from "crypto";
import api from "../clients/nearapp.client";
import { Request, Response } from "express";

import registrationSchema from "../validations/registration.schema";
import User from "../../db/user.model";
import Wallet from "../../db/wallet.model";
import {
  RegistrationRequestDTO,
  UserVerificationRequestDTO,
  UserLoginRequestDTO,
} from "../interfaces/user.interface";
import {
  extractTokenExpiration,
  generateAccessToken,
} from "../helpers/auth.helper";
import { TokenPayload } from "../interfaces/tokenPayload.interface";
import { AnyLengthString } from "aws-sdk/clients/comprehendmedical";

export const registration = async function (req: Request, res: Response) {
  const registrationDTO: RegistrationRequestDTO = req.body;

  try {
    await registrationSchema.validate(req.body);
  } catch (err) {
    console.info({ err });
    return res.status(500).json({ type: err.name, message: err.message });
  }

  try {
    try {
      // Create a new user on the near network
      const newSession = await api.createUserAccount({
        fullName: registrationDTO.fullName,
        walletName: registrationDTO.walletName,
        email: registrationDTO.email,
        phone: registrationDTO.phone,
      });

      console.info({ newSession });
    } catch (err) {
      console.info({ err });
      return res.status(500).json(err.response.data);
    }
    // Find existing wallet by walletName
    const existingWallet = await Wallet.scan({
      walletName: registrationDTO.walletName,
    }).exec();
    // if wallet alraedy exists, exit with error "wallet already exists"
    if (existingWallet.count > 0) {
      return res
        .status(500)
        .json({ error: "Wallet already exists, please login" });
    }

    // if wallet doesn't exist create user:
    const newUserId = crypto.randomUUID();
    const newUser = await User.create({
      id: newUserId,
      type: registrationDTO.mode,
    });

    if (!newUser) {
      return res.status(500).json({ error: "Could not create user" });
    }

    // Create wallet and associate with user
    const newWallet = await Wallet.create({
      id: crypto.randomUUID(),
      userId: newUserId,
      walletName: registrationDTO.walletName,
      email: registrationDTO.mode === "email" ? registrationDTO.email : "",
      phone: registrationDTO.mode === "phone" ? registrationDTO.phone : "",
    });
    if (!newWallet) {
      return res.status(500).json({ error: "Could not create wallet" });
    }

    const payload: TokenPayload = {
      id: newUserId,
      walletName: registrationDTO.walletName,
      jwt_access_token: newSession.jwt_access_token,
      jwt_refresh_token: newSession.jwt_refresh_token,
    };
    const token = generateAccessToken(
      payload,
      extractTokenExpiration(newSession.jwt_access_token)
    );

    // return id, status and new session (jwtAccessToken, jwtIdToken, jwtRefreshToken, user_info)
    res.json({
      id: newUser.id,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error has happened" });
  }
};

export const verifyUser = async function (req: Request, res: Response) {
  const { walletName, code }: UserVerificationRequestDTO = req.body;

  if (!walletName || !code) {
    return res.status(400).json({ type: "MISSING_PARAMETERS" });
  }

  const wallets: any = await Wallet.scan({
    walletName,
  }).exec();

  if (wallets.count === 0) {
    return res.status(500).json({ error: "Wallet doesn't exist" });
  }

  try {
    const newSession = await api.verifyUser({
      walletName,
      nonce: code,
    });

    const payload: TokenPayload = {
      id: wallets[0].userId,
      walletName: wallets[0].walletName,
      jwt_access_token: newSession.jwt_access_token,
      jwt_refresh_token: newSession.jwt_refresh_token,
    };
    const token = generateAccessToken(
      payload,
      extractTokenExpiration(newSession.jwt_access_token)
    );

    return res.json({
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not verify user" });
  }
};

export const createPasscode = async function (req: any, res: Response) {
  const { code }: any = req.body;

  if (!code) {
    return res.status(400).json({ type: "MISSING_PARAMETERS" });
  }

  const user = await User.get(req.session.id);

  if (!user) {
    return res.status(500).json({ error: "Wallet doesn't exist" });
  }

  try {
    await User.update({
      id: user.id,
      passcode: code,
    });
    res.json({ ok: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not verify user" });
  }
};

export const verifyPasscode = async function (req: any, res: Response) {
  const { code }: any = req.body;

  if (!code) {
    return res.status(400).json({ type: "MISSING_PARAMETERS" });
  }

  const user = await User.get(req.session.id);

  if (!user) {
    return res.status(500).json({ error: "Wallet doesn't exist" });
  }

  try {
    res.json({ valid: user.passcode === code });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not verify user" });
  }
};

export const loginUser = async function (req: Request, res: Response) {
  const { walletName }: UserLoginRequestDTO = req.body;
  try {
    const existingWallet = await Wallet.scan({
      walletName,
    }).exec();

    if (existingWallet.count === 0) {
      return res.status(500).json({ error: "Wallet doesn't exist" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Could not find user" });
  }

  try {
    const loginResponse = await api.loginUserWithWallet({
      walletName,
    });

    return res.json(loginResponse);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not login user" });
  }
};

export const getDetailsByUserId = async (req: Request, res: Response) => {
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
    res.status(500).json({ error: "Could not get user details by userId" });
  }
};

export const getDetails = async (req: any, res: any) => {
  try {
    const userId = req.session.id;
    console.info({ userId });
    const user = await User.get(userId);
    user.wallets = await Wallet.scan({ userId: userId }).exec();
    console.info({ user });

    interface ResponseDTO {
      id: string;
      wallets: {
        walletName: string;
        email: string;
      };
    }

    const response: ResponseDTO = {
      id: user.id,
      wallets: user.wallets.map((wallet: any) => ({
        walletName: wallet.walletName,
        email: wallet.email,
      })),
    };

    res.json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not get user details" });
  }
};
