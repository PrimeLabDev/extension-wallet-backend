import * as dynamoose from "dynamoose";

const OFFERS_TABLE = `${process.env.OFFERS_TABLE}`;

export const OFFER_STATUSES = {
  Sent: "Sent",
  Accepted: "Accepted",
  Rejected: "Rejected",
  Revoked: "Revoked",
  CounterOffer: "CounterOffer",
};

export const OfferSchema = new dynamoose.Schema(
  {
    id: String,
    nft_id: String,
    owner_id: String,
    user_id: String,
    expire_in: Date,
    days_to_expire: Number,
    amount: Number,
    status: {
      type: String,
      enum: [
        OFFER_STATUSES.Sent,
        OFFER_STATUSES.Accepted,
        OFFER_STATUSES.Rejected,
        OFFER_STATUSES.Revoked,
        OFFER_STATUSES.CounterOffer,
      ],
    },
    details: Object,
  },
  {
    timestamps: true,
    saveUnknown: ["details.**"],
  }
);

const OfferModel = dynamoose.model(OFFERS_TABLE, OfferSchema, {
  create: false,
});

export default OfferModel;
