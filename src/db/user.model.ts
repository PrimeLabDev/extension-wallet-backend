import * as dynamoose from "dynamoose";

const USERS_TABLE = `${process.env.USERS_TABLE}`;

export const USER_STATUS = {
  NONE_CREATED: "NONE_CREATED",
  PENDING_VERIFICATION: "PENDING_VERIFICATION",
  ACCOUNT_CREATED: "ACCOUNT_CREATED",
};

export const UserSchema = new dynamoose.Schema(
  {
    id: String,
    email: String,
    phone: String,
    type: String,
    fullName: String,
    walletName: String,
    status: String,
    wallets: {
      type: Array,
      schema: [
        {
          type: Object,
          schema: {
            walletName: String,
          },
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = dynamoose.model(USERS_TABLE, UserSchema, { create: false });

export default UserModel;
