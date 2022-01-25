import { Response } from "express";

import NotificationService from "../services/notification.service";
import { TokenPayload } from "../interfaces/tokenPayload.interface";
import { RequestWithSession } from "../interfaces/express.interface";

const notificationService = new NotificationService();

export const getNotifications = async function (
  req: RequestWithSession,
  res: Response
) {
  const session: TokenPayload = req.session;
  try {
    const notifications = await notificationService.getNotificationsByUserId(
      session.near_api.user_info.user_id
    );
    res.json(notifications);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

export const getUnreadNotificationsAmount = async function (
  req: RequestWithSession,
  res: Response
) {
  const session: TokenPayload = req.session;
  try {
    const notifications = await notificationService.getUnreadNotificationsByUserId(
      session.near_api.user_info.user_id
    );
    res.json({ count: notifications.length });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};
