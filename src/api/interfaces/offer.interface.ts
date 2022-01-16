export interface CreateOfferRequestDTO {
  id: string,
  nft_id: string,
  owner_id: number,
  user_id: number,
  expire_in: Date,
  days_to_expire: number,
  amount: number,
}
