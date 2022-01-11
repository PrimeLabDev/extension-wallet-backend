import * as jwt from "jsonwebtoken";
import { TokenPayload } from "../interfaces/tokenPayload.interface";

export function generateAccessToken(user: TokenPayload, expiresIn) {
  console.info({ expiresIn });
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET || "", {
    notBefore: expiresIn,
  });
}

export function generateRefreshToken(user) {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET || "");
}

export function extractTokenExpiration(token): any {
  const { payload }: any = jwt.decode(token, { complete: true });
  return payload.exp;
}
