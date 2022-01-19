export interface CreateOfferRequestDTO {
  nft_id: string,
  owner_id: number,
  user_id: number,
  expire_in: Date,
  days_to_expire: number,
  amount: number,
}

export interface UpdateOfferRequestDTO {
  id: string,
  days_to_expire: number,
  amount: number,
}
