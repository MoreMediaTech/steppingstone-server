import { Expo, ExpoPushMessage } from "expo-server-sdk";
import createError from "http-errors";
import { PushToken } from "@prisma/client";
import { env } from "./env";

const expo = new Expo({ accessToken: env.EXPO_ACCESS_TOKEN });

export const sendPushNotification = async (
  token: PushToken[],
  title: string,
  body: string
) => {
  try {
    if (token.length === 0) {
      const pushToken = token[0].token;
      if (!Expo.isExpoPushToken(pushToken)) {
        throw new createError.BadRequest(
          `Push token ${pushToken} is not a valid Expo push token`
        );
      }

      const message: ExpoPushMessage = {
        to: pushToken,
        sound: "default",
        title,
        body,
        data: { title, body },
      };
      const notification = await expo.sendPushNotificationsAsync([message]);
      return { success: true, message: "Notification sent", notification}
    } else {
        const messages: ExpoPushMessage[] = [];
        for (const pushToken of token) {
            if (!Expo.isExpoPushToken(pushToken.token)) {
            throw new createError.BadRequest(
                `Push token ${pushToken.token} is not a valid Expo push token`
            );
            }
            messages.push({
            to: pushToken.token,
            sound: "default",
            title,
            body,
            data: { title, body },
            });
        }
        const notification = await expo.sendPushNotificationsAsync(messages);
        return { success: true, message: "Notification sent", notification}
    }
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(
      "Unable to send push notification"
    );
  }
};
