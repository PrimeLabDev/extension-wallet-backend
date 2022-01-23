import * as crypto from "crypto";

import Wallet from "../../db/wallet.model";

export class WalletService {
  createWallet = async ({
    userId,
    mode,
    phone,
    email,
    walletName,
  }): Promise<any> => {
    return await Wallet.create({
      id: crypto.randomUUID(),
      user_id: userId,
      walletName: walletName,
      email: mode === "email" ? email : "",
      phone: mode === "phone" ? phone : "",
    }).catch((err) => {
      console.info({ err });
      throw "Could not create wallet";
    });
  };

  getWalletByWalletName = async ({ walletName }): Promise<any> => {
    const wallets = await Wallet.scan({ walletName })
      .exec()
      .catch((err) => {
        console.info({ err });
        throw "Could not get wallet by walletName";
      });
    if (wallets.length === 0) {
      return null;
    } else {
      return wallets[0];
    }
  };

  getWalletsByUserId = async ({ userId }): Promise<any> => {
    return await Wallet.scan({ userId: userId })
      .exec()
  }
}

export default WalletService;
