# HomePageAPI Serverless Components

# Steps to run the project locally

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
https://xkfvqk07j4.execute-api.us-east-1.amazonaws.com/api

All merges to master will deploy automatically to the production server.

https://272xbehlbj.execute-api.us-east-1.amazonaws.com/api

## DATABASE

The databa consist in DynamoDB tables, accesed with the dynamoose npm package.
All tables will be suffixed with the corresponding enrivonment (dev or production)

#### Tables

User: users-table-dev (to be renamed to extension-users-dev)

```
{
  id: string,
  passcode: string,
  cretedAt: timestamp,
  udpatedAt: timestamp,
}
```

Wallets: wallets-table-dev (to be renamed to extension-wallets-dev)

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

Offers: extension-offers-dev

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
