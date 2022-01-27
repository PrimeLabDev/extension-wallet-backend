import * as crypto from "crypto";

import Wallet from "../../db/wallet.model";

export class WalletService {
  createWallet = async ({ userId, phone, email, walletName }): Promise<any> => {
    return await Wallet.create({
      id: crypto.randomUUID(),
      user_id: userId,
      walletName,
      email,
      phone,
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

  getWalletsByUserId = async (userId): Promise<any> => {
    return Wallet.scan({ userId: userId }).exec();
  };
}

export default WalletService;
