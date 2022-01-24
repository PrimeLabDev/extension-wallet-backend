import * as jwt from "jsonwebtoken";
import { TokenPayload } from "../interfaces/tokenPayload.interface";

export class AuthService {
  generateAccessToken = (payload: TokenPayload) => {
    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET || "", {
      expiresIn: "24h",
    });
    console.info({ generateAccessToken: token });
    return token;
  };
}

export default AuthService;
