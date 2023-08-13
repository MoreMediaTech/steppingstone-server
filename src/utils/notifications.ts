import { Expo, ExpoPushMessage } from "expo-server-sdk";
import createError from "http-errors";
import { env } from "./env";


const expo = new Expo({ accessToken: env.EXPO_ACCESS_TOKEN });

export const sendPushNotification = async (token: string, title: string, body: string) => {
    if (!Expo.isExpoPushToken(token)) {
        throw new createError.BadRequest(`Push token ${token} is not a valid Expo push token`);
    }

    const message: ExpoPushMessage = {
        to: token,
        sound: "default",
        title,
        body,
        data: { title, body },
    };
    
    try {
        const notification = await expo.sendPushNotificationsAsync([message]);
        console.log(notification);
    } catch (error) {
        console.error(error);
        throw new createError.InternalServerError("Unable to send push notification");
    }
};