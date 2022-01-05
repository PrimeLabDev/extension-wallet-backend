import * as express from "express";
import {
  registration,
  checkExistence,
} from "./controllers/registration.controller";

import UserController from "./controllers/user.controller";

var router = express.Router();

router.post("/registration", registration);
router.get("/registration/check_existence", checkExistence);
router.get("/user", UserController.getDetails)

module.exports = router;
