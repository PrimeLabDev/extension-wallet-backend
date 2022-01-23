import Notification from "../../db/notifications.model";

export class NotificationService {
  getNotificationsByUserId = async (user_id) => {
    try {
      return await Notification.scan({
        recipient_user_id: user_id,
      });
    } catch (error) {
      console.log(error);
      throw "Could not get user's notifications";
    }
  };
}

export default NotificationService;
