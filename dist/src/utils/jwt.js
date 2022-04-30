var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
import jwt from "jsonwebtoken";
const accessTokenSecret = (_a = process.env.JWT_SECRET) !== null && _a !== void 0 ? _a : "";
const generateToken = (id) => {
    return jwt.sign({ id }, accessTokenSecret, {
        expiresIn: "30d",
    });
};
const verifyAccessToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    return jwt.verify(token, accessTokenSecret);
});
export { generateToken, verifyAccessToken };
//# sourceMappingURL=jwt.js.map