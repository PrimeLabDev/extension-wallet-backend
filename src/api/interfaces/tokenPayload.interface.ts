export interface TokenPayload {
  id: string;
  near_api: {
    jwt_access_token: string;
    jwt_refresh_token: string;
    user_info: {
      created: number;
      email: string;
      full_name: string;
      phone: string;
      status: string;
      user_id: string;
      verified: boolean;
      wallet_id: string;
      wallet_status: string;
    };
  };
}
