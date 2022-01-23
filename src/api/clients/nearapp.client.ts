import axios from "axios";

import {
  CreateNearWalletRequestDTO,
  VerifyUserRequestDTO,
  LoginUserWithWalletRequestDTO,
} from "../interfaces/nearApps.interface";

const baseUrl = `${process.env.NEAR_USERS_API_URL}`;

const api = {
  createUserAccount: async (data: CreateNearWalletRequestDTO) => {
    return axios
      .post(`${baseUrl}/user/create`, JSON.stringify(data), {
        headers: {
          "content-type": "application/json",
          "Authorization": `Bearer eyJraWQiOiJmdjZkSFwvQ05Bajk5bE10b2V2K2hrMFVBUWRZeGRyK2dlTGNJYWpqRTlCMD0iLCJhbGciOiJSUzI1NiJ9.eyJvcmlnaW5fanRpIjoiYTY4OGQ4NmYtYWUwNC00YzYyLWE0MjMtMjRkZWUyYzVmZWQ1Iiwic3ViIjoiYTExMzdhNzUtZTAzYS00MTZmLTlmMTgtMDM3YzdhZTA1NWE5IiwiZXZlbnRfaWQiOiI1MjU4ZDgzMi1jYTQ3LTQzYmYtOTA2YS00MGEyYWVhYjAyM2EiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIiwiYXV0aF90aW1lIjoxNjQyODgxMTkwLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9hSlUxRThUWVciLCJleHAiOjE2NDI5Njc1OTAsImlhdCI6MTY0Mjg4MTE5MCwianRpIjoiN2U3ODVhNmYtYTZkNy00YjcwLTgxODctN2EzMmM0MGZhZmY3IiwiY2xpZW50X2lkIjoiMWg4ajM3ZW44ZXEwNGU0bnVsOGw3Z2U0YW4iLCJ1c2VybmFtZSI6Im9saGFfbmZ0Lm5lYXIifQ.zsAhNbJYv8tPHdHP7VEryP2cPDR6vlk6cHb_6RdAD_bybAhzv1lVAC7eo6P82__oCaELwIX5oWbkJ3hzQ4dGf-7q6VcSxESoXhBcOiboAVSLhiUA-10l-VVHSmxte8e1T9SNweSssD5lBhbkTOO5QgnepA77pYLIWj3FXFxdboDKeI7TNHzbIwekHYj0i5CDjQTcKtdakrQNOJ8Y7fLoTwvUGZ4XLIgaQFuYOphVtDi4PBTzDxOCTt0APbqJFCiiNYvVJYcWUOw0LEN_DYxNYcE6_LCoY4UgEbDAMq0fzH6XALDNTZ2_glaI7HgqBPnq0ix80NhEkWUF0qTJy90Dn`,  
        },
      })
      .then((response) => response.data);
  },
  verifyUser: async (data: VerifyUserRequestDTO) => {
    return axios
      .post(`${baseUrl}/login/verify`, data)
      .then((response) => response.data);
  },
  loginUserWithWallet: async (data: LoginUserWithWalletRequestDTO) => {
    return axios
      .post(`${baseUrl}/login`, data)
      .then((response) => response.data);
  },
  getUserDetails: async (user_id: string) => {
    return axios
      .get(`${baseUrl}/user/${user_id}`)
      .then((response) => response.data);
  },
  getNFTDetails: async (nft_id: string) => {
    return axios
      .get(`${baseUrl}/nfts/${nft_id}`)
      .then((response) => response.data);
  },
};

export default api;
