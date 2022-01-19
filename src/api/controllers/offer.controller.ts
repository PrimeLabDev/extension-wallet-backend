import * as crypto from "crypto";
import { Response } from "express";

import api from "../clients/nearapp.client";
import offerSchema from "../validations/offer.schema";
import Offer, { OFFER_STATUSES } from "../../db/offer.model";
import {
  CreateOfferRequestDTO,
  UpdateOfferRequestDTO,
} from "../interfaces/offer.interface";
import { TokenPayload } from "../interfaces/tokenPayload.interface";
import { RequestWithSession } from "../interfaces/express.interface";
import { NearAppsOfferDTO } from "../interfaces/nearApps.interface";

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

    const details: NearAppsOfferDTO = await api
      .getNFTDetails(createOfferRequestDTO.nft_id)
      .catch((err) => {
        // return nftDetailsMock;
        console.info({ err });
        throw "Could not get nft details";
      });

    // if wallet doesn't exist create user:
    var expireIn = new Date();
    expireIn.setDate(expireIn.getDate() + createOfferRequestDTO.days_to_expire);
    const newOfferId = crypto.randomUUID();
    const newOffer = await Offer.create({
      id: newOfferId,
      nft_id: createOfferRequestDTO.nft_id,
      owner_id: details.data.owner_id,
      user_id: session.near_api.user_info.user_id,
      expire_in: expireIn,
      days_to_expire: createOfferRequestDTO.days_to_expire,
      amount: createOfferRequestDTO.amount,
      status: OFFER_STATUSES.Sent,
      details: details.data,
    }).catch((err) => {
      console.info({ err });
      throw "Could not create offer";
    });

    // return id, status and new session (jwtAccessToken, jwtIdToken, jwtRefreshToken, user_info)
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
  console.info({
    id: offerId,
    user_id: session.near_api.user_info.user_id,
  });

  try {
    await offerSchema.validate(req.body).catch((err) => {
      throw "Invalid params";
    });

    const offers: any = await Offer.scan({
      id: offerId,
      user_id: session.near_api.user_info.user_id,
    })
      .exec()
      .catch((err) => {
        console.info({ err });
        throw "Could not find offer";
      });
    console.info({offers});
    if (offers.count === 0) {
      throw "Could not find offer";
    }

    const offer = offers[0];

    // if wallet doesn't exist create user:
    var expireIn = new Date();
    expireIn.setDate(expireIn.getDate() + updateOfferRequestDTO.days_to_expire);
    await Offer.update(offerId, {
      // TODO: Extend time
      expire_in: expireIn,
      days_to_expire: updateOfferRequestDTO.days_to_expire,
      amount: updateOfferRequestDTO.amount,
      status: OFFER_STATUSES.Sent,
    }).catch((err) => {
      console.info({ err });
      throw "Could not update offer";
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
    const offers = await Offer.scan({
      user_id: session.near_api.user_info.user_id,
    })
      .exec()
      .catch((err) => {
        console.info({ err });
        throw "Could not get sent offers";
      });

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
    const offers = await Offer.scan({
      owner_id: session.near_api.user_info.user_id,
    })
      .exec()
      .catch((err) => {
        console.info({ err });
        throw "Could not get received offers";
      });

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
    const offers = await Offer.scan({
      id: req.params.id,
      owner_id: session.near_api.user_info.user_id,
    })
      .exec()
      .catch((err) => {
        console.info({ err });
        throw "Offer not found";
      });

    if (offers.count === 0) {
      throw "Offer not found";
    }

    await Offer.update({ id: offerId, status: OFFER_STATUSES.Rejected }).catch(
      (err) => {
        console.info({ err });
        throw "Could not reject offer";
      }
    );
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
    const offers = await Offer.scan({
      id: req.params.id,
      user_id: session.near_api.user_info.user_id,
    })
      .exec()
      .catch((err) => {
        console.info({ err });
        throw "Offer not found";
      });

    if (offers.count === 0) {
      throw "Offer not found";
    }
    console.info({ offers });

    await Offer.update(offerId, {
      status: OFFER_STATUSES.Revoked,
    }).catch((err) => {
      console.info({ err });
      throw "Could not revoke offer";
    });
  } catch (error) {
    return res.status(500).json({ error });
  }

  res.json({ message: "Offer revoked" });
};
