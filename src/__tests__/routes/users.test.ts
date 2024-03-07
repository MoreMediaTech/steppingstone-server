import request from "supertest";
import app from "../../app";
import { userController } from "../../v1/controllers/user.controller";




describe("User Routes", () => {
    const mockUser = {
      name: "Jane Doe",
      email: "janed@test.com",
      acceptTermsAndConditions: false,
      role: "USER",
      isAdmin: false,
      organisation: "Test Company",
      postCode: "N1 1AA",
      district: "Ashfield",
      contactNumber: "0123456789",
      county: "northampton",
    };
  it("returns status code 201 after user has been created", async () => {
    const res = await request(app)
      .post("/v1/users")
      .send(mockUser)
      .expect(201);
    expect(res.statusCode).toEqual(201);
  });
    it.todo("should get all users");
    it.todo("should get a user by id");
    it.todo("should update a user by id");
    it.todo("should delete a user by id");
    it.todo("should sign up for newsletter");

})