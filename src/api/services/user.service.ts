import * as crypto from "crypto";

import User from "../../db/user.model";

export class UserService {
  getUserById(id: string): Promise<any> {
    return User.get(id);
  }

  createUser = async ({ type }): Promise<any> => {
    const newUserId = crypto.randomUUID();
    return await User.create({
      id: newUserId,
      type: type,
    }).catch((err) => {
      console.info({ err });
      throw "Could not create user";
    });
  };

  updateUserCode = async ({ userId, code }): Promise<any> => {
    return await User.update({
      id: userId,
      passcode: code,
    }).catch((err) => {
      console.info({ err });
      throw "Could not update user";
    });
  };
}

export default UserService;
