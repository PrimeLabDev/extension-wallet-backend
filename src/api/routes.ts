import * as express from "express";
import {
  registration,
  checkExistense,
  verifyUser,
  loginUser,
} from "./controllers/user.controller";

var router = express.Router();

router.post("/user/registration", registration);
router.post("/user/check_existence", checkExistense);
router.post("/user/verify", verifyUser);
router.post("/user/login", loginUser);

module.exports = router;
