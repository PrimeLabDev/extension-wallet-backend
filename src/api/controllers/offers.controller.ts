import { Response } from "express";

import offerSchema from "../validations/offer.schema";
import {
  CreateOfferRequestDTO,
  UpdateOfferRequestDTO,
} from "../interfaces/offer.interface";
import { TokenPayload } from "../interfaces/tokenPayload.interface";
import { RequestWithSession } from "../interfaces/express.interface";
import OfferService from "../services/offer.service";
import NFTService from "../services/nfts.service";
import NotificationService from "../services/notification.service";
import UserService from "../services/user.service";

const userService = new UserService();
const offerService = new OfferService();
const nftService = new NFTService();
const notificationService = new NotificationService();

const NOTIFICATION_TYPES = {
  OfferSent: "OfferSent",
  OfferUpdated: "OfferUpdated",
  OfferCounterOffered: "OfferCounterOffered",
  OfferRejected: "OfferRejected",
  OfferRevoked: "OfferRevoked",
  OfferAccepted: "OfferAccepted",
};

export const createOffer = async function (
  req: RequestWithSession,
  res: Response
) {
  const createOfferRequestDTO: CreateOfferRequestDTO = req.body;
  const session: TokenPayload = req.session;

  try {
    await offerSchema.validate(req.body).catch((err) => {
      throw "Invalid params";
    });

    const nft = await nftService.getDetails(createOfferRequestDTO.nft_id);

    const newOffer = await offerService
      .createOffer({
        nft_id: createOfferRequestDTO.nft_id,
        user_id: session.near_api.user_info.user_id,
        days_to_expire: createOfferRequestDTO.days_to_expire,
        amount: createOfferRequestDTO.amount,
        nft,
      })
      .then(async (offer) => {
        await notificationService
          .createNotification({
            type: NOTIFICATION_TYPES.OfferSent,
            sender_user_id: session.near_api.user_info.user_id,
            recipient_user_id: nft.data.owner_id,
            data: {
              sender_wallet_name: session.near_api.user_info.wallet_id,
              amount: createOfferRequestDTO.amount,
              nft_title: nft.data.title,
              offer_id: offer.id,
            },
          })
          .catch((err) => {
            console.log("Could not create notification", err);
          });
      });

    res.json(newOffer);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

export const updateOffer = async function (
  req: RequestWithSession,
  res: Response
) {
  const updateOfferRequestDTO: UpdateOfferRequestDTO = req.body;
  const session: TokenPayload = req.session;
  const offerId = req.params.id;

  try {
    await offerSchema.validate(req.body).catch((err) => {
      throw "Invalid params";
    });

    const offer = await offerService.getOfferById(offerId);
    if (!offer || offer.user_id !== session.near_api.user_info.user_id) {
      throw "Offer does not belong to user";
    }

    const nft = await nftService.getDetails(offer.nft_id);

    await offerService
      .updateOffer(
        offerId,
        updateOfferRequestDTO.days_to_expire,
        updateOfferRequestDTO.amount
      )
      .then(async (offer) => {
        await notificationService
          .createNotification({
            type: NOTIFICATION_TYPES.OfferUpdated,
            sender_user_id: session.near_api.user_info.user_id,
            recipient_user_id: nft.data.owner_id,
            data: {
              sender_wallet_name: session.near_api.user_info.wallet_id,
              amount: offer.amount,
              nft_title: nft.data.title,
              offer_id: offer.id,
            },
          })
          .catch((err) => {
            console.log("Could not create notification", err);
          });
      });

    res.json({ message: "Offer updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

export const getSentOffers = async function (
  req: RequestWithSession,
  res: Response
) {
  const session: TokenPayload = req.session;

  try {
    const offers = await offerService.getSentOffers(
      session.near_api.user_info.user_id
    );

    res.json(offers);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

export const getReceivedOffers = async function (
  req: RequestWithSession,
  res: Response
) {
  const session: TokenPayload = req.session;

  try {
    const offers = await offerService.getReceivedOffers(
      session.near_api.user_info.user_id
    );

    res.json(offers);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

export const getReceivedOffersByNFTId = async function (
  req: RequestWithSession,
  res: Response
) {
  const session: TokenPayload = req.session;
  const nftId = req.params.id;
  try {
    const offers = await offerService.getReceivedOffersByNftId(nftId);

    res.json(offers);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

export const rejectOffer = async function (
  req: RequestWithSession,
  res: Response
) {
  const session: TokenPayload = req.session;
  const offerId = req.params.id;
  try {
    const offer = await offerService.getOfferById(offerId);

    if (offer.owner_id !== session.near_api.user_info.user_id) {
      throw "Offer does not belong to user";
    }

    await offerService.rejectOffer(offerId).then(async (offer) => {
      const ownerDetails = await userService.getUserById(offer.owner_id);
      await notificationService
        .createNotification({
          type: NOTIFICATION_TYPES.OfferRejected,
          sender_user_id: offer.owner_id,
          recipient_user_id: offer.user_id,
          data: {
            sender_wallet_name: ownerDetails.wallet_id,
            offer_id: offer.id,
          },
        })
        .catch((err) => {
          console.log("Could not create notification", err);
        });
    });
    res.json({ message: "Offer rejected" });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const revokeOffer = async function (
  req: RequestWithSession,
  res: Response
) {
  const session: TokenPayload = req.session;
  const offerId = req.params.id;
  try {
    const offer: any = await offerService
      .getOfferById(offerId)
      .then(async (offer) => {
        const ownerDetails = await userService.getUserById(offer.user_id);
        await notificationService
          .createNotification({
            type: NOTIFICATION_TYPES.OfferRevoked,
            sender_user_id: offer.user_id,
            recipient_user_id: offer.owner_id,
            data: {
              sender_wallet_name: ownerDetails.wallet_id,
              offer_id: offer.id,
            },
          })
          .catch((err) => {
            console.log("Could not create notification", err);
          });
      });

    if (offer.user_id !== session.near_api.user_info.user_id) {
      throw "Offer does not belong to user";
    }

    await offerService.revokeOffer(offerId);
    res.json({ message: "Offer revoked" });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
