import {} from "@prisma/client";
import { prismaMock } from "../../../singleton";
import { authService } from "../auth.service";
import { PartialUserSchemaProps } from "../../../schema/User";

describe("Auth Service", () => {
  describe("createUser", () => {
    it("should fail if user does not accept terms", async () => {
      const user: PartialUserSchemaProps = {
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

      prismaMock.user.create.mockRejectedValue(
        new Error("You must accept the terms and conditions")
      );

      await expect(authService.createUser(user)).resolves.toEqual(
        new Error("You must accept the terms and conditions")
      );
    });
    it.todo("create a new user", async () => {
      // const user = {
      //   id: "1",
      //   name: "Jane Doe",
      //   email: "janed@test.com",
      //   acceptTermsAndConditions: true,
      //   role: "USER",
      //   isAdmin: false,
      //   organisation: "Test Company",
      //   postCode: "N1 1AA",
      //   contactNumber: "0123456789",
      //   county: "northampton",
      //   district: "Ashfield",
      // };
      // prismaMock.user.create.mockResolvedValue(user);
      // expect(createUser(user)).resolves.toEqual(user);
    });

    it.todo("should fail if user already exists");
  });
});
