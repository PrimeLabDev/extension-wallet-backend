import * as dynamoose from "dynamoose";

const WALLETS_TABLE = `${process.env.WALLETS_TABLE}`;

export const WalletSchema = new dynamoose.Schema(
  {
    id: String,
    userId: String,
    walletName: String,
    email: String,
    phone: String,
    fullName: String,
  },
  {
    timestamps: true,
  }
);

const WalletModel = dynamoose.model(WALLETS_TABLE, WalletSchema, {
  create: false,
});

export default WalletModel;
