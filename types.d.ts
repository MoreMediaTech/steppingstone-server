import { User as PrismaUser } from "@prisma/client";
import { Express } from "express";
import { PassportStatic } from "passport";
import "express-session"

export {};

declare global {
  namespace Express {
      interface Request extends Application {
        authInfo?: AuthInfo | undefined;
        user?: User | undefined;

        // These declarations are merged into express's Request type
        /**
         * Initiate a login session for `user`.
         *
         * Options:
         *   - `session`  Save login state in session, defaults to `true`.
         *
         * Examples:
         *
         *     req.logIn(user, { session: false });
         *
         *     req.logIn(user, function(err) {
         *       if (err) { throw err; }
         *       // session saved
         *     });
         */
        login(user: User, done: (err: any) => void): void;
        login(
          user: User,
          options: passport.LogInOptions,
          done: (err: any) => void
        ): void;
        /**
         * Initiate a login session for `user`.
         *
         * Options:
         *   - `session`  Save login state in session, defaults to `true`.
         *
         * Examples:
         *
         *     req.logIn(user, { session: false });
         *
         *     req.logIn(user, function(err) {
         *       if (err) { throw err; }
         *       // session saved
         *     });
         */
        logIn(user: User, done: (err: any) => void): void;
        logIn(
          user: User,
          options: passport.LogInOptions,
          done: (err: any) => void
        ): void;

        /**
         * Terminate an existing login session.
         */
        logout(options: passport.LogOutOptions, done: (err: any) => void): void;
        logout(done: (err: any) => void): void;
        /**
         * Terminate an existing login session.
         */
        logOut(options: passport.LogOutOptions, done: (err: any) => void): void;
        logOut(done: (err: any) => void): void;

        /**
         * Test if request is authenticated.
         */
        isAuthenticated(): this is AuthenticatedRequest;
        /**
         * Test if request is unauthenticated.
         */
        isUnauthenticated(): this is UnauthenticatedRequest;
      }

      interface AuthenticatedRequest extends Request {
        user: User;
      }

      interface UnauthenticatedRequest extends Request {
        user?: undefined;
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
