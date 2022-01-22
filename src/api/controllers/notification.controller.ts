import { Response } from "express";

import Notification from "../../db/notifications.model";
import { TokenPayload } from "../interfaces/tokenPayload.interface";
import { RequestWithSession } from "../interfaces/express.interface";

export const getNotifications = async function (
  req: RequestWithSession,
  res: Response
) {
  const session: TokenPayload = req.session;

  try {
    const notifications = await Notification.scan({
      recipient_user_id: session.near_api.user_info.user_id,
    })
      .exec()
      .catch((err) => {
        console.info({ err });
        throw "Could not get user's notifications";
      });

    res.json(notifications);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};
