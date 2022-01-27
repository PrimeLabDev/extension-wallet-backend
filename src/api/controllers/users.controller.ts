import api from "../clients/nearapp.client";
import { Request, Response } from "express";

import registrationSchema from "../validations/registration.schema";
import {
  RegistrationRequestDTO,
  UserVerificationRequestDTO,
  UserLoginRequestDTO,
} from "../interfaces/user.interface";
import { TokenPayload } from "../interfaces/tokenPayload.interface";
import { RequestWithSession } from "../interfaces/express.interface";
import UserService from "../services/user.service";
import WalletService from "../services/wallet.service";
import AuthService from "../services/auth.service";

const userService = new UserService();
const walletService = new WalletService();
const authService = new AuthService();

export const createUser = async function (req: Request, res: Response) {
  const registrationDTO: RegistrationRequestDTO = req.body;

  try {
    await registrationSchema.validate(req.body);
  } catch (err) {
    console.info({ err });
    return res.status(500).json({ type: err.name, message: err.message });
  }

  try {
    const newSession = await api
      .createUserAccount({
        fullName: registrationDTO.fullName,
        walletName: registrationDTO.walletName,
        email: registrationDTO.email,
        phone: registrationDTO.phone,
      })
      .catch((err) => {
        console.info({ error_message: err.response?.data?.message });
        throw err.response?.data?.message;
        // return res.status(500).json({ type: err.name, message: err.message });
      });

    const existingWallet = await walletService.getWalletByWalletName({
      walletName: registrationDTO.walletName,
    });
    if (!!existingWallet) {
      return res
        .status(500)
        .json({ error: "Wallet already exists, please login" });
    }

    const newUser: any = userService.createEmptyUser();

    await walletService.createWallet({
      userId: newUser.id,
      walletName: registrationDTO.walletName,
      email: registrationDTO.email,
      phone: registrationDTO.phone,
    });

    const payload: TokenPayload = {
      id: newUser.id,
      near_api: newSession,
    };
    const token = authService.generateAccessToken(payload);

    res.json({
      id: newUser.id,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const verifyUser = async function (req: Request, res: Response) {
  const { walletName, code }: UserVerificationRequestDTO = req.body;

  if (!walletName || !code) {
    return res.status(400).json({ type: "MISSING_PARAMETERS" });
  }

  const existingWallet = await walletService.getWalletByWalletName({
    walletName: walletName,
  });

  if (!existingWallet) {
    return res.status(404).json({ error: "Wallet doesn't exist" });
  }

  try {
    const newSession = await api.verifyUser({
      walletName,
      nonce: code,
    });

    const payload: TokenPayload = {
      id: existingWallet.userId,
      near_api: newSession,
    };
    console.info({ payload });
    const token = authService.generateAccessToken(payload);

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

  const user = await userService.getUserById(req.session.id);

  if (!user) {
    return res.status(500).json({ error: "Wallet doesn't exist" });
  }

  try {
    await userService
      .updateUserCode({
        userId: user.id,
        code,
      })
      .catch((err) => {
        console.info({ err });
        throw "Could not update user";
      });
    res.json({ ok: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not verify user" });
  }
};

export const verifyPasscode = async function (
  req: RequestWithSession,
  res: Response
) {
  const { code }: any = req.body;

  if (!code) {
    return res.status(400).json({ type: "MISSING_PARAMETERS" });
  }

  const user = await userService.getUserById(req.session.id);

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
    const existingWallet = await walletService.getWalletByWalletName({
      walletName,
    });
    if (!existingWallet) {
      return res.status(404).json({ error: "Wallet doesn't exist" });
    }

    const loginResponse = await api.loginUserWithWallet({
      walletName,
    });

    return res.json(loginResponse);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not login user" });
  }
};

export const getDetailsByUserId = async (
  req: RequestWithSession,
  res: Response
) => {
  const session: TokenPayload = req.session;
  try {
    const nearAppsUser = await api.getUserDetails(
      session.near_api.user_info.user_id
    );
    const user = await userService.getUserById(session.id);
    if (!user) {
      throw "Could not find user";
    }
    res.json({
      ...nearAppsUser,
      ...user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not get user details by userId" });
  }
};

export const getDetails = async (req: RequestWithSession, res: any) => {
  const session: TokenPayload = req.session;

  try {
    const user = await userService.getUserById(session.id).catch((err) => {
      throw "Could not get user";
    });
    if (!user) {
      throw "Could not find user";
    }

    const nearAppsUser = await api
      .getUserDetails(session.near_api.user_info.user_id)
      .catch((err) => {
        console.info({ err });
        throw "Could not get nearapp user details";
      });

    user.wallets = await walletService
      .getWalletsByUserId(user.id)
      .catch((err) => {
        console.info({ err });
        throw "Could not get user wallets";
      });

    const response = {
      nearAppsUser: nearAppsUser?.data,
      user: {
        id: user.id,
        wallets: user.wallets.map((wallet: any) => ({
          walletName: wallet.walletName,
          email: wallet.email,
        })),
      },
    };

    res.json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not get user details" });
  }
};
