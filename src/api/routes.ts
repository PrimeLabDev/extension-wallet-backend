import * as express from "express";
import {
  registration,
  checkExistence,
} from "./controllers/registration.controller";

var router = express.Router();

router.post("/registration", registration);
router.get("/registration/check_existence", checkExistence);

module.exports = router;
