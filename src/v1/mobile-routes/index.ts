import { Application } from "express";
import { router as authRoutes } from "./auth.routes";
import { router as userRoutes } from "./user.routes";
import { router as content } from "./content.routes";
import { router as notificationsRoutes } from "./notifications.routes";
import { router as messagesRoutes } from "./messages.routes";
import { router as uploadRoutes } from "./upload.routes";
import { router as advertRoutes } from "./adverts.routes";

export const mobileRouterConfig = (app: Application) => {
    app.use("/v1/mobile/auth", authRoutes);
    app.use("/v1/mobile/users", userRoutes);
    app.use("/v1/mobile/content", content);
    app.use("/v1/mobile/notifications", notificationsRoutes);
    app.use("/v1/mobile/messages", messagesRoutes);
    app.use("/v1/mobile/upload", uploadRoutes);
    app.use("/v1/mobile/adverts", advertRoutes);
};