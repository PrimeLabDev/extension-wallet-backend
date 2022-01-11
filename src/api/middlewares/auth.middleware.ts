import * as jwt from "jsonwebtoken";

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "", (err, payload) => {
    console.log(err);
    if (err) return res.sendStatus(403);
    req.session = payload;
    next();
  });
}

export default authenticateToken;
