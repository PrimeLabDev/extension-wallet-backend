import * as express from "express";
import {
  registration,
  verifyUser,
  loginUser,
  getDetailsByUserId,
  getDetails,
  createPasscode,
  verifyPasscode,
} from "./controllers/user.controller";
import authenticateToken from "./middlewares/auth.middleware";

var router = express.Router();

router.post("/user/create", registration);
router.post("/user/verify", verifyUser);
router.post("/user/login", loginUser);
router.get("/user/details", authenticateToken, getDetails);
router.post("/user/passcode", authenticateToken, createPasscode);
router.post("/user/passcode/verify", authenticateToken, verifyPasscode);
router.get("/user/:user_id", authenticateToken, getDetailsByUserId);

module.exports = router;
