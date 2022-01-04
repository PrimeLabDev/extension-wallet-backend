import * as dynamoose from "dynamoose";

const USERS_TABLE = process.env.USERS_TABLE || "";

export const USER_STATUS = {
  NONE_CREATED: "NONE_CREATED",
  PENDING_VERIFICATION: "PENDING_VERIFICATION",
  PENDING_NEAR_ACCT: "PENDING_NEAR_ACCT",
};

export const UserSchema = new dynamoose.Schema(
  {
    id: String,
    email: String,
    phone: String,
    type: String,
    firstName: String,
    nearAccountId: String,
    phrase: String,
    status: String,
    passcode: String,
  },
  {
    timestamps: true,
  }
);

const UserModel = dynamoose.model(USERS_TABLE, UserSchema);

export default UserModel;
