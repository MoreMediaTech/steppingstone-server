import { User as PrismaUser } from "@prisma/client";
import { Express } from "express";
import { PassportStatic } from "passport";
import "express-session"

export {};

declare global {
  namespace Express {
    interface Request extends Application {
      user?: Partial<PrismaUser>;
    }

    interface User extends PrismaUser {}
  }
}

declare module "express-session" {
  interface Session {
    user?: Partial<PrismaUser>;
    passport?: PassportStatic
  }
}
