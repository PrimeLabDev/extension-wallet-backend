import * as express from "express";
import {
  registration,
  verifyUser,
  loginUser,
  getDetails,
} from "./controllers/user.controller";
import authenticateToken from "./middlewares/auth.middleware";

var router = express.Router();

router.post("/user/registration", registration);
router.post("/user/verify", verifyUser);
router.post("/user/login", loginUser);
router.get("/user/:user_id", authenticateToken, getDetails);

module.exports = router;
