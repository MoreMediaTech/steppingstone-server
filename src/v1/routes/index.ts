import { Application } from "express";
import { router as authRoutes } from "./auth.routes";
import { router as userRoutes } from "./user.routes";
import { router as partnerRoutes } from "./partner.routes";
import { router as refreshRoutes } from "./refresh-token.routes";
import { router as messagesRoutes } from "./messages.routes";
import { router as editorRoutes } from "./content.routes";
import { router as uploadRoute } from "./upload.routes";
import { router as analyticsRoutes } from "./analytics.routes";
import { router as publicFeedRoute } from "./public-feed.routes";
import { router as notificationsRoutes } from "./notifications.routes";
import { router as supportRoutes } from "./support-log.routes";
import { router as advertRoutes } from "./adverts.routes";

export const appRouterConfig = (app: Application) => {
  app.use("/v1/auth", authRoutes);
  app.use("/v1/refresh", refreshRoutes);
  app.use("/v1/messages", messagesRoutes);
  app.use("/v1/analytics", analyticsRoutes);
  app.use("/v1/feed", publicFeedRoute);
  app.use("/v1/adverts", advertRoutes);
  app.use("/v1/users", userRoutes);
  app.use("/v1/partners", partnerRoutes);
  app.use("/v1/content", editorRoutes);
  app.use("/v1/upload", uploadRoute);
  app.use("/v1/notifications", notificationsRoutes);
  app.use("/v1/support", supportRoutes);
};
