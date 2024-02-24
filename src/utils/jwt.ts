import dotenv from "dotenv";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";

dotenv.config();

const accessTokenSecret = process.env.JWT_SECRET as string;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET as string;

const generateToken = (userId: string, expires: string): Promise<string> => {
  return new Promise((resolve, _reject) => {
    const token = jwt.sign({ sub: userId, iat: Date.now() }, accessTokenSecret, {
      expiresIn: expires,
      algorithm: "HS256",
    });

    resolve(token)
  });
};

const generateRefreshToken = (userId: string): Promise<string> => {
  return new Promise((resolve, _reject) => {
    const token = jwt.sign(
      { sub: userId, iat: Date.now() },
      refreshTokenSecret,
      {
        expiresIn: "7d",
      }
    );
    resolve(token);
  });
};

const verifyAccessToken = async (
  token: string
  ): Promise<string | jwt.JwtPayload> => {
  return jwt.verify(token, accessTokenSecret, { algorithms: ["HS256"] });
};
export { generateToken, verifyAccessToken, generateRefreshToken };
