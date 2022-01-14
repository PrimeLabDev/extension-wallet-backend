import * as dynamoose from "dynamoose";

const WALLETS_TABLE = `${process.env.WALLETS_TABLE}`;

export const WalletSchema = new dynamoose.Schema(
  {
    id: String,
    userId: String,
    walletName: String,
    email: String,
    phone: String,
    mode: String,
    fullName: String,
  },
  {
    timestamps: true,
  }
);

const UserModel = dynamoose.model(
  WALLETS_TABLE,
  WalletSchema
  , { create: false }
);

export default UserModel;
