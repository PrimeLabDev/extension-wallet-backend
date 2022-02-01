# HomePageAPI Serverless Components

# Steps to run the project locally

#### Install aws client for on your OS ([click here](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)) and run:

```
aws configure
```


## Install yarn and install packages

```
npm install --g yarn
yarn install
```

## Run server on port 3001 by default

```
yarn dev
```

## How to test and deploy

All merges made to the **dev** branch, will deploy automatically to the dev environment living in this URL

https://xkfvqk07j4.execute-api.us-east-1.amazonaws.com

All merges to **main** will deploy automatically to the production server via  **Github Actions** (configuration file on .github/workflows/main.yml).

https://4bwgh31qeh.execute-api.us-east-1.amazonaws.com


## Postman collection

https://universal-shadow-890045.postman.co/workspace/Homepage---Extension~bc8870f9-83e5-4a1b-b8af-02770e7359de/overview

## DATABASE

The databa consist in DynamoDB tables, accesed with the dynamoose npm package.
All tables will be suffixed with the corresponding enrivonment (dev or prod)

#### Tables

User: extension-users-(dev|prod)

```
{
  id: string,
  passcode: string,
  cretedAt: timestamp,
  udpatedAt: timestamp,
}
```
![image](https://user-images.githubusercontent.com/6401468/151684730-08824c4b-53a4-421d-8a8c-c0b6f298575e.png)

Wallets: extension-wallets-(dev|prod)

```
{
  id: String,
  userId: String,
  walletName: String,
  email: String,
  phone: String,
  fullName: String,
}
```
![image](https://user-images.githubusercontent.com/6401468/151684726-c2acd7a3-6bab-4d64-99d7-58df6a32d24f.png)


Offers: extension-offers-(dev|prod)

```
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
}
```
![image](https://user-images.githubusercontent.com/6401468/151673382-9b895144-1e3d-4326-ace7-9f17e77b6321.png)


Offers: extension-notifications-(dev|prod)

```
{
  id: String,
  sender_user_id: String,
  recipient_user_id: String,
  type: {
    type: String,
    enum: [
      NOTIFICATION_TYPES.OfferSent,
      NOTIFICATION_TYPES.OfferUpdated,
      NOTIFICATION_TYPES.OfferCounterOffered,
      NOTIFICATION_TYPES.OfferRejected,
      NOTIFICATION_TYPES.OfferRevoked,
      NOTIFICATION_TYPES.OfferAccepted,
    ],
  },
  read: Boolean,
  data: Object,
}
```

![image](https://user-images.githubusercontent.com/6401468/151684717-18906831-93bb-4e6b-87ec-d7151d888846.png)


