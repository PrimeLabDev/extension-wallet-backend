import axios from "axios";

import {
  CreateNearWalletRequestDTO,
  VerifyUserRequestDTO,
  LoginUserWithWalletRequestDTO,
} from "../interfaces/nearApps.interface";

const baseUrl = `${process.env.NEAR_USERS_API_URL}`;

const api = {
  proxyNearApps: async ({ method, url, token, data, params }) => {
    return axios({
      method,
      url: `${baseUrl}${url}`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      params,
      data,
    });
  },
  createUserAccount: async (data: CreateNearWalletRequestDTO) => {
    return axios
      .post(`${baseUrl}/user/create`, data)
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
      .get(`${baseUrl}/users/${user_id}`)
      .then((response) => response.data);
  },
  getNFTDetails: async (nft_id: string) => {
    return axios
      .get(`${baseUrl}/nfts/${nft_id}`)
      .then((response) => response.data);
  },
};

export default api;
