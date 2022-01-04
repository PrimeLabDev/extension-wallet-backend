export interface NearApiUser {
  operation: string;
  args: {
    email: string;
    phone: string;
    account_id: string;
    fullname?: string;
  };
  tags?: {
    app_id: string;
    action_id: string;
    user_id: string;
  };
}
