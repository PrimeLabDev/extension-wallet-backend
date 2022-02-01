import * as AWS from "aws-sdk";

var dynamoDB = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

const NOTIFICATIONS_TABLE = process.env.NOTIFICATIONS_TABLE || "";

export class NotificationService {
  getNotificationsByUserId = async (user_id) => {
    try {
      const items = await dynamoDB
        .query({
          TableName: NOTIFICATIONS_TABLE,
          KeyConditionExpression: "recipient_user_id = :x",
          ExpressionAttributeValues: {
            ":x": AWS.DynamoDB.Converter.input(user_id),
          },
          ScanIndexForward: false,
        })
        .promise();
      return items.Items?.map((item: any) =>
        AWS.DynamoDB.Converter.unmarshall(item)
      );
    } catch (error) {
      console.log(error);
      throw "Could not get user's notifications";
    }
  };

  getUnreadNotificationsByUserId = async (user_id) => {
    try {
      const items = await dynamoDB
        .query({
          TableName: NOTIFICATIONS_TABLE,
          IndexName: "recipient_user_id-is_read-index",
          KeyConditionExpression: "recipient_user_id = :x AND is_read = :y",
          ExpressionAttributeValues: {
            ":x": AWS.DynamoDB.Converter.input(user_id),
            ":y": AWS.DynamoDB.Converter.input(0),
          },
          ScanIndexForward: false,
        })
        .promise();
      return items.Items?.map((item: any) =>
        AWS.DynamoDB.Converter.unmarshall(item)
      );
    } catch (error) {
      console.log(error);
      throw "Could not get user's notifications unread amount";
    }
  };

  markAllNotificationsAsRead = async (user_id) => {
    try {
      const items = await dynamoDB
        .query({
          TableName: NOTIFICATIONS_TABLE,
          KeyConditionExpression: "recipient_user_id = :x",
          ExpressionAttributeValues: {
            ":x": AWS.DynamoDB.Converter.input(user_id),
          },
          ScanIndexForward: false,
        })
        .promise();
      const notifications = items.Items?.map((item: any) =>
        AWS.DynamoDB.Converter.unmarshall(item)
      );
      notifications?.forEach(async (notification) => {
        await dynamoDB
          .updateItem({
            TableName: NOTIFICATIONS_TABLE,
            Key: {
              recipient_user_id: AWS.DynamoDB.Converter.input(
                notification.recipient_user_id
              ),
              createdAt: AWS.DynamoDB.Converter.input(notification.createdAt),
            },
            UpdateExpression: "set is_read = :x",
            ExpressionAttributeValues: {
              ":x": AWS.DynamoDB.Converter.input(1),
            },
          })
          .promise();
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
      return await dynamoDB
        .putItem({
          TableName: NOTIFICATIONS_TABLE,
          Item: {
            type: AWS.DynamoDB.Converter.input(type),
            sender_user_id: AWS.DynamoDB.Converter.input(sender_user_id),
            recipient_user_id: AWS.DynamoDB.Converter.input(recipient_user_id),
            is_read: AWS.DynamoDB.Converter.input(0),
            data: AWS.DynamoDB.Converter.input(data),
            createdAt: AWS.DynamoDB.Converter.input(new Date().getTime()),
          },
        })
        .promise();
    } catch (error) {
      console.log(error);
      throw "Could not create notification";
    }
  };
}

export default NotificationService;
