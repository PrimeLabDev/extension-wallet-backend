import * as express from "express";
import {
  getContact,
  getContactList,
  createContact,
  updateContact,
  importContacts,
  getNFT,
  getNFTs,
  getNFTTransactions,
  getUserTransactions,
  getTransactionDetails,
  getAppDetails,
  getApps
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
  markAllNotificationsAsRead,
} from "./controllers/notifications.controller";
import authenticateToken from "./middlewares/auth.middleware";

var router = express.Router();

// NEARAPPS PROXY ENDPOINTS
router.get("/contacts/:contactId", authenticateToken, getContact);
router.get("/contacts/list/:userId", authenticateToken, getContactList);
router.post("/contacts", authenticateToken, createContact);
router.put("/contacts/:contactId", authenticateToken, updateContact);
router.post("/contacts/import", authenticateToken, importContacts);
router.get("/nfts/:nftId", authenticateToken, getNFT);
router.get("/nfts/list", authenticateToken, getNFTs);
router.get("/nfts/:id/offers/received", authenticateToken, getReceivedOffersByNFTId);
router.get("/transactions/nft/:nftId", authenticateToken, getNFTTransactions);
router.get("/transactions/list/:userId", authenticateToken, getUserTransactions);
router.get("/transactions/:id", authenticateToken, getTransactionDetails);
router.get("/apps/:appId", authenticateToken, getAppDetails);
router.get("/apps", authenticateToken, getApps);

// Notifications
router.get("/notifications", authenticateToken, getNotifications);
router.get("/notifications/unread/amount", authenticateToken, getUnreadNotificationsAmount);
router.put("/notifications/read", authenticateToken, markAllNotificationsAsRead);

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
