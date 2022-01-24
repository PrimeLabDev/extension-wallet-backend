import api from "../clients/nearapp.client";
import { Response } from "express";
import { RequestWithSession } from "../interfaces/express.interface";

const buildNearAppsRequest = (req: RequestWithSession) => {
  return {
    method: req.method,
    url: req.path,
    token: req.session.near_api.jwt_access_token,
    data: req.body,
    params: req.query,
  };
};

export const getContactDetails = async function (
  req: RequestWithSession,
  res: Response
) {
  const nearAppsRequest = buildNearAppsRequest(req);
  const response = await api.proxyNearApps(nearAppsRequest);
  res.status(response.status).json(response.data);
};
