import dotenv from "dotenv";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";

dotenv.config();
const accessTokenSecret = process.env.JWT_SECRET as string;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET as string;

const generateToken = (userId: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const token = jwt.sign({ userId: userId }, accessTokenSecret, {
      expiresIn: "1h",
    });

    resolve(token);
  });
};

const generateRefreshToken = (userId: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const token = jwt.sign({ userId: userId }, refreshTokenSecret, {
      expiresIn: "1d",
    });
    resolve(token);
  });
};

const verifyAccessToken = async (
  token: string
): Promise<string | jwt.JwtPayload> => {
  return jwt.verify(token, accessTokenSecret);
};
export { generateToken, verifyAccessToken, generateRefreshToken };
