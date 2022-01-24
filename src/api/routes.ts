import * as express from "express";
import {
  createUser,
  verifyUser,
  loginUser,
  getDetailsByUserId,
  getDetails,
  createPasscode,
  verifyPasscode,
} from "./controllers/users.controller";
import {
  createOffer,
  updateOffer,
  getSentOffers,
  getReceivedOffers,
  rejectOffer,
  revokeOffer,
} from "./controllers/offers.controller";
import { getNotifications } from "./controllers/notifications.controller";
import authenticateToken from "./middlewares/auth.middleware";

var router = express.Router();

router.get("/notifications", authenticateToken, getNotifications);

router.post("/offer/create", authenticateToken, createOffer);
router.patch("/offer/update/:id", authenticateToken, updateOffer);
router.get("/offer/sent", authenticateToken, getSentOffers);
router.get("/offer/received", authenticateToken, getReceivedOffers);
router.patch("/offer/reject/:id", authenticateToken, rejectOffer);
router.patch("/offer/revoke/:id", authenticateToken, revokeOffer);

router.post("/user/create", createUser);
router.post("/user/verify", verifyUser);
router.post("/user/login", loginUser);
router.get("/user/details", authenticateToken, getDetails);
router.post("/user/passcode", authenticateToken, createPasscode);
router.post("/user/passcode/verify", authenticateToken, verifyPasscode);
router.get("/user", authenticateToken, getDetailsByUserId);

module.exports = router;
