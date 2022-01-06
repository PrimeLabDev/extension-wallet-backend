import axios from "axios";

import {
  CreateNearWalletRequestDTO,
  VerifyUserRequestDTO,
  LoginUserWithWalletRequestDTO,
} from "../interfaces/nearApi.interface";

const baseUrl = `${process.env.NEAR_USERS_API_URL}`;

const api = {
  createUserAccount: async (data: CreateNearWalletRequestDTO) => {
    return axios
      .post(`${baseUrl}/user/create`, data)
      .then((response) => response.data);
  },
  verifyUser: async (data: VerifyUserRequestDTO) => {
    return axios
      .post(`${baseUrl}/user/verify`, data)
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
};

export default api;
