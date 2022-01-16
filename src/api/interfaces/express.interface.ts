import { Request } from "express";
import { TokenPayload } from "./tokenPayload.interface";

export interface RequestWithSession extends Request {
  session: TokenPayload;
}
