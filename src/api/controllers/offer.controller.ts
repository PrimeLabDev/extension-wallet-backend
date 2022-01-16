import * as crypto from "crypto";
import { Request, Response } from "express";

import api from "../clients/nearapp.client";
import offerSchema from "../validations/offer.schema";
import Offer from "../../db/offer.model";
import { CreateOfferRequestDTO } from "../interfaces/offer.interface";
import { TokenPayload } from "../interfaces/tokenPayload.interface";
import { RequestWithSession } from "../interfaces/express.interface";
import { NearAppsOfferDTO } from "../interfaces/nearApps.interface";
import nftDetailsMock from "./mocks/offer.mock";

export const createOffer = async function (
  req: RequestWithSession,
  res: Response
) {
  const createOfferRequestDTO: CreateOfferRequestDTO = req.body;
  console.info({ body: req.body });
  const session: TokenPayload = req.session;

  try {
    await offerSchema.validate(req.body).catch((err) => {
      throw "Invalid params";
    });

    const details: NearAppsOfferDTO = await api
      .getNFTDetails(createOfferRequestDTO.nft_id)
      .catch((err) => {
        return nftDetailsMock;
        console.info({ err });
        throw "Could not get nft details";
      });
    console.info({ details });
    // if wallet doesn't exist create user:
    var expireIn = new Date();
    expireIn.setDate(expireIn.getDate() + createOfferRequestDTO.days_to_expire);
    const newOfferId = crypto.randomUUID();
    const newOffer = await Offer.create({
      id: newOfferId,
      nft_id: createOfferRequestDTO.nft_id,
      owner_id: details.owner_id,
      user_id: session.near_api.user_info.user_id,
      expire_in: expireIn,
      days_to_expire: createOfferRequestDTO.days_to_expire,
      amount: createOfferRequestDTO.amount,
      status: "Sent",
      details: details,
      logs: [],
      createdAt: new Date(),
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
