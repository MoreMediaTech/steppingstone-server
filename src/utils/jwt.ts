import dotenv  from 'dotenv';
import jwt from "jsonwebtoken";
dotenv.config();
const accessTokenSecret = process.env.JWT_SECRET ?? "";

const generateToken = (id: string) => {
  return jwt.sign({ id }, accessTokenSecret, {
    expiresIn: "7d",
  });
};
const verifyAccessToken = async (
  token: string
): Promise<string | jwt.JwtPayload> => {
  return jwt.verify(token, accessTokenSecret);
};
export { generateToken, verifyAccessToken };
