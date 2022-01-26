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

const offerService = new OfferService();
const nftService = new NFTService();

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

    const newOffer = await offerService.createOffer({
      nft_id: createOfferRequestDTO.nft_id,
      user_id: session.near_api.user_info.user_id,
      days_to_expire: createOfferRequestDTO.days_to_expire,
      amount: createOfferRequestDTO.amount,
      nft,
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

    await offerService.updateOffer(
      offerId,
      updateOfferRequestDTO.days_to_expire,
      updateOfferRequestDTO.amount
    );

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

    await offerService.rejectOffer(offerId);
    res.json({ message: "Offer rejected" });
  } catch (error) {
    return res.status(500).json({ error });
  }

  res.json({ message: "Offer rejected" });
};

export const revokeOffer = async function (
  req: RequestWithSession,
  res: Response
) {
  const session: TokenPayload = req.session;
  const offerId = req.params.id;
  try {
    const offer = await offerService.getOfferById(offerId);

    if (offer.user_id !== session.near_api.user_info.user_id) {
      throw "Offer does not belong to user";
    }

    await offerService.revokeOffer(offerId);
    res.json({ message: "Offer revoked" });
  } catch (error) {
    return res.status(500).json({ error });
  }

  res.json({ message: "Offer revoked" });
};
