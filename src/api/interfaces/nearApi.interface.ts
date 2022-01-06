export interface CreateNearWalletRequestDTO {
  fullName: string;
  walletName: string;
  email: string;
  phone: string;
}

export interface VerifyUserRequestDTO {
  account_id: string;
  code: string;
}

export interface LoginUserWithWalletRequestDTO {
  account_id?: string;
  phone?: string;
  email?: string;
  mode: string;
}
