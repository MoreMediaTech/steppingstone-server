import { prisma, Role } from "@prisma/client";
import { prismaMock } from "../../singleton";
import { createUser, loginUser } from "../auth.service";

describe("Auth Service", () => {
  describe("createUser", () => {
    it("should fail if user does not accept terms", async () => {
      const user = {
        id: "1",
        name: "Jane Doe",
        email: "janed@test.com",
        password: "12345678",
        confirmPassword: "12345678",
        acceptTermsAndConditions: false,
        role: Role.USER,
        isAdmin: false,
        county: "northampton",
      };

      prismaMock.user.create.mockRejectedValue(
        new Error("You must accept the terms and conditions")
      );

      await expect(createUser(user)).resolves.toEqual(
        new Error("You must accept the terms and conditions")
      );
    });
    it("create a new user", async () => {
      const user = {
        id: "1",
        name: "Jane Doe",
        email: "janed@test.com",
        password: "12345678",
        confirmPassword: "12345678",
        acceptTermsAndConditions: true,
        role: Role.USER,
        isAdmin: false,
        county: "northampton",
      };
      
      prismaMock.user.create.mockResolvedValue(user);
      expect(createUser(user)).resolves.toEqual(user);
    });

    it.todo
    
    ("should fail if user already exists")
  });
});
