import api from "../clients/nearapp.client";
import { Response } from "express";
import { RequestWithSession } from "../interfaces/express.interface";

export const getContact = async function (
  req: RequestWithSession,
  res: Response
) {
  const nearAppsRequest = buildNearAppsRequest(req);
  const response = await api.proxyNearApps(nearAppsRequest);
  res.status(response.status).json(response.data);
};

export const getContactList = async function (
  req: RequestWithSession,
  res: Response
) {
  const nearAppsRequest = buildNearAppsRequest(req);
  const response = await api.proxyNearApps(nearAppsRequest);
  res.status(response.status).json(response.data);
};

export const createContact = async function (
  req: RequestWithSession,
  res: Response
) {
  const nearAppsRequest = buildNearAppsRequest(req);
  const response = await api.proxyNearApps(nearAppsRequest);
  res.status(response.status).json(response.data);
};

export const updateContact = async function (
  req: RequestWithSession,
  res: Response
) {
  const nearAppsRequest = buildNearAppsRequest(req);
  const response = await api.proxyNearApps(nearAppsRequest);
  res.status(response.status).json(response.data);
};

export const getNFT = async function (req: RequestWithSession, res: Response) {
  const nearAppsRequest = buildNearAppsRequest(req);
  console.info({ nearAppsRequest });
  const response = await api.proxyNearApps(nearAppsRequest);
  res.status(response.status).json(response.data);
};

export const getNFTs = async function (req: RequestWithSession, res: Response) {
  const nearAppsRequest = buildNearAppsRequest(req);
  const response = await api.proxyNearApps(nearAppsRequest);
  res.status(response.status).json(response.data);
};

const buildNearAppsRequest = (req: RequestWithSession) => {
  return {
    method: req.method,
    url: req.path,
    token: req.session.near_api.jwt_access_token,
    data: req.body,
    params: req.query,
  };
};
