import * as dynamoose from "dynamoose";

const USERS_TABLE = `${process.env.USERS_TABLE}`;

export const USER_STATUS = {
  NO_WALLET: "NO_WALLET",
  PENDING_VERIFICATION: "PENDING_VERIFICATION",
  PENDING_WALLET_CREATION: "PENDING_WALLET_CREATION",
  VERIFIED: "VERIFIED",
};

export const UserSchema = new dynamoose.Schema(
  {
    id: String,
    status: String,
    passcode: String,
  },
  {
    timestamps: true,
  }
);

const UserModel = dynamoose.model(USERS_TABLE, UserSchema, { create: false });

export default UserModel;
