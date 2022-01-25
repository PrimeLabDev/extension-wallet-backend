import axios from "axios";
import * as jwt from "jsonwebtoken";
import { TokenPayload } from "../interfaces/tokenPayload.interface";

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET || "",
    (err, payload: TokenPayload) => {
      if (err) return res.sendStatus(403);
      req.session = payload;
      axios.defaults.headers[
        "Authorization"
      ] = `Bearer ${payload.near_api.jwt_access_token}`;
      next();
    }
  );
}

export default authenticateToken;
