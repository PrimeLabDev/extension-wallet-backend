export interface RegistrationRequestDTO {
  mode: string;
  fullName: string;
  walletName: string;
  email: string;
  phone: string;
}

export interface UserLoginRequestDTO {
  account_id?: string;
  email?: string;
  phone?: string;
  mode: string;
}

export interface UserCheckExistenceRequestDTO {
  mode: string;
  email: string;
  phone: string;
}

export interface UserVerificationRequestDTO {
  account_id: string;
  code: string;
}
