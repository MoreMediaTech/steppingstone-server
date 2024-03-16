import request from "supertest";
import app from "../../app";
import { userController } from "../../v1/controllers/user.controller";




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

describe("User Routes", () => {
  describe("GET /getMe", () => {
    it("should call userController.getMe", async () => {
      await request(app).get("/getMe");
      expect(userController.getMe).toHaveBeenCalled();
    });
  });

  describe("POST /notifications", () => {
    it("should call userController.addOrRemovePushNotificationToken", async () => {
      await request(app).post("/notifications");
      expect(
        userController.addOrRemovePushNotificationToken
      ).toHaveBeenCalled();
    });
  });

  describe("GET /favorites", () => {
    it("should call userController.getUserFavorites", async () => {
      await request(app).get("/favorites");
      expect(userController.getUserFavorites).toHaveBeenCalled();
    });
  });

  describe("POST /favorites", () => {
    it("should call userController.addToFavorites", async () => {
      await request(app).post("/favorites");
      expect(userController.addToFavorites).toHaveBeenCalled();
    });
  });

  describe("DELETE /favorites/:id", () => {
    it("should call userController.removeFromFavorites", async () => {
      await request(app).delete("/favorites/123");
      expect(userController.removeFromFavorites).toHaveBeenCalled();
    });
  });

  describe("GET /:id", () => {
    it("should call userController.getUserById if authenticated", async () => {
      const authenticatedRequest = request(app)
        .get("/123")
        .set("Authorization", "Bearer <JWT_TOKEN>");
      expect(authenticatedRequest).toHaveProperty("isAuthenticated");
      expect(userController.getUserById).toHaveBeenCalled();
    });

    it("should not call userController.getUserById if not authenticated", async () => {
      const unauthenticatedRequest = request(app).get("/123");
      expect(unauthenticatedRequest).not.toHaveProperty("isAuthenticated");
      expect(userController.getUserById).not.toHaveBeenCalled();
    });
  });

  describe("PUT /:id", () => {
    it("should call userController.updateUserProfile", async () => {
      await request(app).put("/123");
      expect(userController.updateUserProfile).toHaveBeenCalled();
    });
  });
});