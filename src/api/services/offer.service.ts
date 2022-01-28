import * as crypto from "crypto";

import Offer, { OFFER_STATUSES } from "../../db/offer.model";

export class OfferService {
  createOffer = async ({
    nft_id,
    user_id,
    days_to_expire,
    amount,
    nft,
  }): Promise<any> => {
    const newOfferId = crypto.randomUUID();
    var expireIn = new Date();
    expireIn.setDate(expireIn.getDate() + days_to_expire);
    return await Offer.create({
      id: newOfferId,
      nft_id: nft_id,
      owner_id: nft.data.owner_id,
      user_id: user_id,
      expire_in: expireIn,
      days_to_expire: days_to_expire,
      amount: amount,
      status: OFFER_STATUSES.Sent,
      details: nft,
    }).catch((err) => {
      console.info({ err });
      throw "Could not create offer";
    });
  };

  updateOffer = async (offerId, days_to_expire, amount): Promise<any> => {
    var expireIn = new Date();
    expireIn.setDate(expireIn.getDate() + days_to_expire);
    return await Offer.update(
      { id: offerId },
      {
        expire_in: expireIn,
        days_to_expire: days_to_expire,
        amount: amount,
        status: OFFER_STATUSES.Sent,
      }
    ).catch((err) => {
      console.info({ err });
      throw "Could not update offer";
    });
  };

  getOfferById = async (offerId) => {
    try {
      return Offer.get(offerId);
    } catch (error) {
      console.log(error);
      throw `Could not get offer by id=${offerId}`;
    }
  };

  getSentOffers = async (user_id) => {
    try {
      return await Offer.scan({
        user_id: user_id,
      }).exec();
    } catch (error) {
      console.log(error);
      throw "Could not get sent offers";
    }
  };

  getReceivedOffers = async (user_id) => {
    try {
      return await Offer.scan({
        owner_id: user_id,
      }).exec();
    } catch (error) {
      console.log(error);
      throw "Could not get received offers";
    }
  };

  getReceivedOffersByNftId = async (nft_id) => {
    try {
      return await Offer.scan({
        nft_id: nft_id,
      }).exec();
    } catch (error) {
      console.log(error);
      throw "Could not get received offers";
    }
  };

  revokeOffer = async (offerId) => {
    try {
      return await Offer.update(
        { id: offerId },
        {
          status: OFFER_STATUSES.Revoked,
        }
      );
    } catch (error) {
      console.log(error);
      throw `Could not revoke offer by id=${offerId}`;
    }
  };

  rejectOffer = async (offerId) => {
    try {
      return await Offer.update(
        { id: offerId },
        {
          status: OFFER_STATUSES.Rejected,
        }
      );
    } catch (error) {
      console.log(error);
      throw `Could not reject offer by id=${offerId}`;
    }
  };
}

export default OfferService;
