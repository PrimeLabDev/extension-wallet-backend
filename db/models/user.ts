import * as dynamoose from "dynamoose";

const USERS_TABLE = process.env.USERS_TABLE || "";

const UserSchema = new dynamoose.Schema({ userId: String, name: String });

const UserModel = dynamoose.model(USERS_TABLE, UserSchema);

export default UserModel;
