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
}

export default NotificationService;
