import * as crypto from "crypto";
import Notification from "../../db/notifications.model";

export class NotificationService {
  getNotificationsByUserId = async (user_id) => {
    try {
      return await Notification.scan({
        recipient_user_id: user_id,
      }).exec();
    } catch (error) {
      console.log(error);
      throw "Could not get user's notifications";
    }
  };

  getUnreadNotificationsByUserId = async (user_id) => {
    try {
      return await Notification.scan({
        recipient_user_id: user_id,
        read: false,
      }).exec();
    } catch (error) {
      console.log(error);
      throw "Could not get user's notifications unread amount";
    }
  };

  markAllNotificationsAsRead = async (user_id) => {
    try {
      const notifications = await Notification.scan({
        recipient_user_id: user_id,
        read: false,
      }).exec();
      notifications.forEach(async (notification) => {
        await Notification.update({
          id: notification.id,
          read: true,
        });
      });
    } catch (error) {
      console.log(error);
      throw "Could not get user's notifications unread amount";
    }
  };

  createNotification = async ({
    type,
    sender_user_id,
    recipient_user_id,
    data,
  }) => {
    try {
      return await Notification.create({
        id: crypto.randomUUID(),
        sender_user_id,
        recipient_user_id,
        type,
        data,
        read: false,
      });
    } catch (error) {
      console.log(error);
      throw "Could not create notification";
    }
  };
}

export default NotificationService;
