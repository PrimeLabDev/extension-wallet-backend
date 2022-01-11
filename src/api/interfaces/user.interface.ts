export interface RegistrationRequestDTO {
  mode: string;
  fullName: string;
  walletName: string;
  email: string;
  phone: string;
}

export interface UserLoginRequestDTO {
  walletName?: string;
}
export interface UserVerificationRequestDTO {
  walletName: string;
  code: string;
}
