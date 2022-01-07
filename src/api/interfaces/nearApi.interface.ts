export interface CreateNearWalletRequestDTO {
  fullName: string;
  walletName: string;
  email: string;
  phone: string;
}

export interface VerifyUserRequestDTO {
  walletName: string;
  nonce: string;
}

export interface LoginUserWithWalletRequestDTO {
  walletName?: string;
}
