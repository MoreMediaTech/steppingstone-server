import jwt from "jsonwebtoken";
import createError from "http-errors";
const accessTokenSecret = process.env.JWT_SECRET ?? "";

const generateToken = (id: string) => {
  return jwt.sign({ id }, accessTokenSecret, {
    expiresIn: "30d",
  });
};
const verifyAccessToken = async (
  token: string
): Promise<string | jwt.JwtPayload> => {
  return jwt.verify(token, accessTokenSecret);
};
export { generateToken, verifyAccessToken };
