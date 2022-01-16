import * as dynamoose from "dynamoose";

const OFFERS_TABLE = `${process.env.OFFERS_TABLE}`;

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
      enum: ["Sent", "Accepted", "Rejected", "CounterOffer", "Expired"],
    },
    logs: Array,
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
