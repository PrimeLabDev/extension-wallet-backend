import axios from "axios";

import { NearApiUser } from "../interfaces/nearApi.interface";

const baseUrl = `${process.env.NEAR_API_URL}`;

const api = {
  createUserAccount: async (userAccount: NearApiUser) => {
    return axios.post(`${baseUrl}/user`, userAccount).then((response) => response.data);
  },
};

export default api;
