import { string } from "yup/lib/locale";

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

export interface NearAppsOfferDTO {
  message: string;
  data: {
    title: string;
    description: string;
    category: string;
    attributes: {
      attr_name: string;
      attr_value: string;
    }[];
    file_url: string;
    owner_id: string;
    collection_id: string;
    tracker_id: string;
    created: string;
    updated: string;
  };
}
