import { Request, Response } from "express";
import request from "supertest";
import passport from "passport";
import { app } from "../../app";
import { userController } from "../../v1/controllers/user.controller";
import { PartialUserSchemaProps } from "../../schema/User";

jest.mock("../../v1/controllers/user.controller", () => ({
  userController: {
    getMe: jest.fn(),
    addOrRemovePushNotificationToken: jest.fn(),
    getUserFavorites: jest.fn(),
    addToFavorites: jest.fn(),
    removeFromFavorites: jest.fn(),
    getUserById: jest.fn(),
    updateUserProfile: jest.fn(),
  },
}));

jest.mock("passport", () => ({
  authenticate: jest.fn((strategy: string, options?: any) => {
    return (req: any, res: any, next: any) => {
      // Mock authenticated user
      const user: PartialUserSchemaProps = {
        id: "65be364ea71ec93da4549fc6",
        email: "adewoyin@aolausoro.tech",
        name: "Adewoyin Oladipupo-Usoro",
        isAdmin: true,
        isSuperAdmin: true,
        postCode: "n14 4tp",
        isNewsletterSubscribed: false,
        acceptTermsAndConditions: true,
        isNewlyRegistered: false,
        emailVerified: true,
        isSupportTechnician: true,
        role: "EDITOR",
        allowsPushNotifications: true,
        imageUrl:
          "https://res.cloudinary.com/dhdcepksp/image/upload/v1659035314/stepping-stones/iovcawqspe5doxsimglm.jpg",
      };
      req.user = user;
      next();
    };
  }),
  serializeUser: jest.fn(),
  deserializeUser: jest.fn(),
  use: jest.fn(),
}));

// describe("authenticate middleware", () => {
//   it("should authenticate user with valid credentials", async () => {
//     const req = {} as Request;
//     const res = { send: jest.fn() } as any as Response;
//     const next = jest.fn();
//     const user: PartialUserSchemaProps = {
//       id: "65be364ea71ec93da4549fc6",
//       email: "adewoyin@aolausoro.tech",
//       name: "Adewoyin Oladipupo-Usoro",
//       isAdmin: true,
//       isSuperAdmin: true,
//       postCode: "n14 4tp",
//       isNewsletterSubscribed: false,
//       acceptTermsAndConditions: true,
//       isNewlyRegistered: false,
//       emailVerified: true,
//       isSupportTechnician: true,
//       role: "EDITOR",
//       allowsPushNotifications: true,
//       imageUrl:
//         "https://res.cloudinary.com/dhdcepksp/image/upload/v1659035314/stepping-stones/iovcawqspe5doxsimglm.jpg",
//     };
//     expect(passport.authenticate).toHaveBeenCalledWith("local", undefined);
//     expect(req.user).toHaveBeenCalledWith(user);
//   });
// });

describe("User Routes", () => {
  describe("GET /users", () => {
    it("should return 200 if user is authenticated and is an admin", async () => {
         const user: PartialUserSchemaProps = {
           id: "65be364ea71ec93da4549fc6",
           email: "adewoyin@aolausoro.tech",
           name: "Adewoyin Oladipupo-Usoro",
           isAdmin: true,
           isSuperAdmin: true,
           postCode: "n14 4tp",
           isNewsletterSubscribed: false,
           acceptTermsAndConditions: true,
           isNewlyRegistered: false,
           emailVerified: true,
           isSupportTechnician: true,
           role: "EDITOR",
           allowsPushNotifications: true,
           imageUrl:
             "https://res.cloudinary.com/dhdcepksp/image/upload/v1659035314/stepping-stones/iovcawqspe5doxsimglm.jpg",
         };
      const response = await request(app)
        .get("/users", passport.authenticate('local')).send(user);
        console.log("🚀 ~ it ~ response:", response)
        

      expect(response.status).toBe(200);
      expect(userController.getMe).toHaveBeenCalled();
    });

    // it("should return 401 if user is not authenticated", async () => {
    //   const response = await request(app).get("/users");

    //   expect(response.status).toBe(401);
    //   expect(userController.getUsers).not.toHaveBeenCalled();
    // });
  });

  // describe("POST /users", () => {
  //   it("should return 201 if user is authenticated, is an admin, and has SUPERADMIN role", async () => {
  //     const response = await request(app)
  //       .post("/users")
  //       .set("Authorization", "Bearer <YOUR_AUTH_TOKEN>")
  //       .send({
  //         name: "John Doe",
  //         email: "johndoe@example.com",
  //         password: "password",
  //         role: "SUPERADMIN",
  //       });

  //     expect(response.status).toBe(201);
  //     expect(userController.createUser).toHaveBeenCalled();
  //   });

  //   it("should return 401 if user is not authenticated", async () => {
  //     const response = await request(app).post("/users");

  //     expect(response.status).toBe(401);
  //     expect(userController.createUser).not.toHaveBeenCalled();
  //   });

  //   it("should return 403 if user is authenticated but does not have SUPERADMIN role", async () => {
  //     const response = await request(app)
  //       .post("/users")
  //       .set("Authorization", "Bearer <YOUR_AUTH_TOKEN>")
  //       .send({
  //         name: "John Doe",
  //         email: "johndoe@example.com",
  //         password: "password",
  //         role: "ADMIN",
  //       });

  //     expect(response.status).toBe(403);
  //     expect(userController.createUser).not.toHaveBeenCalled();
  //   });
  // });

  // // Add more tests for other routes...
  // describe("PUT /users/:id", () => {
  //   it("should return 200 if user is authenticated and is an admin", async () => {
  //     const response = await request(app)
  //       .put("/users/123")
  //       .set("Authorization", "Bearer <YOUR_AUTH_TOKEN>")
  //       .send({
  //         name: "John Doe",
  //         email: "johndoe@example.com",
  //         password: "newpassword",
  //         role: "ADMIN",
  //       });
  //     expect(response.status).toBe(200);
  //     expect(userController.updateUserProfile).toHaveBeenCalled();
  //   });
  //   it("should return 401 if user is not authenticated", async () => {
  //     const response = await request(app).put("/users/123");
  //     expect(response.status).toBe(401);
  //     expect(userController.updateUserProfile).not.toHaveBeenCalled();
  //   });
  //   it("should return 403 if user is authenticated but does not have ADMIN role", async () => {
  //     const response = await request(app)
  //       .put("/users/123")
  //       .set("Authorization", "Bearer <YOUR_AUTH_TOKEN>")
  //       .send({
  //         name: "John Doe",
  //         email: "johndoe@example.com",
  //         password: "newpassword",
  //         role: "USER",
  //       });
  //     expect(response.status).toBe(403);
  //     expect(userController.updateUserProfile).not.toHaveBeenCalled();
  //   });
  // });

  // describe("DELETE /users/:id", () => {
  //   it("should return 200 if user is authenticated and is an admin", async () => {
  //     const response = await request(app)
  //       .delete("/users/123")
  //       .set("Authorization", "Bearer <YOUR_AUTH_TOKEN>");
  //     expect(response.status).toBe(200);
  //     expect(userController.deleteUser).toHaveBeenCalled();
  //   });
  //   it("should return 401 if user is not authenticated", async () => {
  //     const response = await request(app).delete("/users/123");
  //     expect(response.status).toBe(401);
  //     expect(userController.deleteUser).not.toHaveBeenCalled();
  //   });
  //   it("should return 403 if user is authenticated but does not have ADMIN role", async () => {
  //     const response = await request(app)
  //       .delete("/users/123")
  //       .set("Authorization", "Bearer <YOUR_AUTH_TOKEN>");
  //     expect(response.status).toBe(403);
  //     expect(userController.deleteUser).not.toHaveBeenCalled();
  //   });
  // });
});
