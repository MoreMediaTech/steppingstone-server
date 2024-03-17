import { prismaMock } from "../../singleton";
import { authService } from "../../v1/services/auth.service";
import { PartialUserSchemaProps } from "../../schema/User";
import prisma from "../../client";
import { Role } from ".prisma/client";

describe("Auth Service", () => {
  // beforeEach(async () => {
  //   await prisma.user.deleteMany({
  //     where: {
  //       email: {
  //         contains: "test.com",
  //       },
  //     },
  //   });
  // });

  afterEach(async () => {
    await prisma.token.deleteMany({
      where: {
        updatedAt: {
          lte: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
        },
      },
    });
    await prisma.user.delete({
      where: {
        email: "tuser@test.com",
      },
    });
  });
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
        isDisabled: false,
      };

      prismaMock.user.create.mockImplementation();

      await expect(authService.createUser(user)).rejects.toThrow(
        new Error("You must accept the terms and conditions")
      );
    });

    it("should fail if user already exists", async () => {
      const user: PartialUserSchemaProps = {
        name: "Jane Doe",
        email: "janed@test.com",
        acceptTermsAndConditions: true,
        role: "USER",
        isAdmin: false,
        organisation: "Test Company",
        postCode: "N1 1AA",
        district: "Ashfield",
        contactNumber: "0123456789",
        county: "northampton",
        isDisabled: false,
      };
      prismaMock.user.findUnique.mockImplementation();
      prismaMock.user.create.mockImplementation();

      await expect(authService.createUser(user)).rejects.toThrow(
        new Error("User already exists!")
      );
    });

    it("should create a new user", async () => {
      const user: PartialUserSchemaProps = {
        name: "test user",
        email: "tuser@test.com",
        acceptTermsAndConditions: true,
        role: "USER",
        isAdmin: false,
        organisation: "Test Company",
        postCode: "N1 1AA",
        district: "Ashfield",
        contactNumber: "0123456789",
        county: "northampton",
        isDisabled: false,
      };
      await prisma.user.delete({
        where: {
          email: "tuser@test.com",
        },
      });

      prismaMock.user.findUnique.mockImplementation();
      prismaMock.user.create.mockImplementation();

      expect(authService.createUser(user)).resolves.toContain({ user });
    });
  });

  describe("authenticateUser", () => {
    afterEach(async () => {
      jest.clearAllMocks();
    });

    it("should authenticate user with valid email", async () => {
      const email = "adewoyin@aolausoro.tech";
      const foundUser = {
        id: "65be364ea71ec93da4549fc6",
        email: "adewoyin@aolausoro.tech",
        name: "Adewoyin Oladipupo-Usoro",
        password: null,
        isAdmin: true,
        isSuperAdmin: true,
        postCode: "n14 4tp",
        imageUrl:
          "https://res.cloudinary.com/dhdcepksp/image/upload/v1659035314/stepping-stones/iovcawqspe5doxsimglm.jpg",
        isNewsletterSubscribed: false,
        acceptTermsAndConditions: true,
        isNewlyRegistered: false,
        emailVerified: true,
        isSupportTechnician: true,
        county: null,
        district: null,
        role: "EDITOR" as Role,
        contactNumber: null,
        allowsPushNotifications: true,
        isDisabled: false,
      };
      const data = {
        email,
        oneTimeCode: undefined,
        isMobile: true,
      };

      prismaMock.user.findUnique.mockResolvedValue(foundUser);
      const result = await authService.authenticateUser(data);

      expect(result.token).toBeTruthy();
      expect(result.user).toEqual(foundUser);
    });

    it("should throw an error if user is not registered", async () => {
      const email = "nonexistent@example.com";

      prismaMock.user.findUnique.mockImplementation();

      await expect(authService.authenticateUser({ email })).rejects.toThrow(
        new Error("User not registered")
      );
    });

    // it("should delete one-time code if provided", async () => {
    //   const email = "adewoyin@aolausoro.tech";
    //   const oneTimeCode = "123456";

    //   const foundUser = {
    //     id: "65be364ea71ec93da4549fc6",
    //     email: "adewoyin@aolausoro.tech",
    //     name: "Adewoyin Oladipupo-Usoro",
    //   };

    //   (prisma.user.findUnique as jest.Mock).mockResolvedValue(foundUser);

    //   await authenticateUser({ email, oneTimeCode });

    //   expect(prisma.token.delete).toHaveBeenCalledWith({
    //     where: { oneTimeCode },
    //   });
    // });

    // it("should generate access token and update user if isMobile is true", async () => {
    //   const email = "adewoyin@aolausoro.tech";
    //   const isMobile = true;

    //   const foundUser = {
    //     id: "65be364ea71ec93da4549fc6",
    //     email: "adewoyin@aolausoro.tech",
    //     name: "Adewoyin Oladipupo-Usoro",
    //   };

    //   const accessToken = "generated-access-token";

    //   (prisma.user.findUnique as jest.Mock).mockResolvedValue(foundUser);
    //   (prisma.user.update as jest.Mock).mockResolvedValue(foundUser);
    //   (prisma.$disconnect as jest.Mock).mockResolvedValue(undefined);

    //   const result = await authenticateUser({ email, isMobile });

    //   expect(prisma.user.update).toHaveBeenCalledWith({
    //     where: { id: foundUser.id },
    //     data: {
    //       tokens: {
    //         create: {
    //           jwtToken: accessToken,
    //           type: "JWT_TOKEN",
    //           expiration: expect.any(Date),
    //         },
    //       },
    //     },
    //   });
    //   expect(prisma.$disconnect).toHaveBeenCalled();
    //   expect(result.token).toBe(accessToken);
    //   expect(result.user).toEqual(foundUser);
    // });
  });
});
