import * as express from "express";
import {
  getContact,
  getContactList,
  createContact,
  updateContact,
  getNFT,
  getNFTs,
} from "./controllers/proxies.controller";
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
  getReceivedOffersByNFTId,
} from "./controllers/offers.controller";
import {
  getNotifications,
  getUnreadNotificationsAmount,
} from "./controllers/notifications.controller";
import authenticateToken from "./middlewares/auth.middleware";

var router = express.Router();

// NEARAPPS PROXY ENDPOINTS
router.get("/contacts/:contactId", authenticateToken, getContact);
router.get("/contacts/list/:userId", authenticateToken, getContactList);
router.post("/contacts", authenticateToken, createContact);
router.put("/contacts/:contactId", authenticateToken, updateContact);
router.get("/nfts/:nftId", authenticateToken, getNFT);
router.get("/nfts/list", authenticateToken, getNFTs);
router.get("/nfts/:id/offers/received", authenticateToken, getReceivedOffersByNFTId);

// Notifications
router.get("/notifications", authenticateToken, getNotifications);
router.get("/notifications/unread/amount", authenticateToken, getUnreadNotificationsAmount);

// Offers
router.post("/offer/create", authenticateToken, createOffer);
router.patch("/offer/update/:id", authenticateToken, updateOffer);
router.get("/offer/sent", authenticateToken, getSentOffers);
router.get("/offer/received", authenticateToken, getReceivedOffers);
router.patch("/offer/reject/:id", authenticateToken, rejectOffer);
router.patch("/offer/revoke/:id", authenticateToken, revokeOffer);

// Users
router.post("/user/create", createUser);
router.post("/user/verify", verifyUser);
router.post("/user/login", loginUser);
router.get("/user/details", authenticateToken, getDetails);
router.post("/user/passcode", authenticateToken, createPasscode);
router.post("/user/passcode/verify", authenticateToken, verifyPasscode);
router.get("/user", authenticateToken, getDetailsByUserId);

module.exports = router;
