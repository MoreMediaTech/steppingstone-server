import { NextFunction, Request, Response } from 'express';
import { allowedOrigins } from '../config/allowedOrigins';


export const credentials = (req: Request, res: Response, next: NextFunction) => {
    const origin = req.headers.origin as string;
    console.log("🚀 ~ file: credentials.ts ~ line 7 ~ credentials ~ origin", origin)
    if (allowedOrigins.indexOf(origin))  {
        res.header("Access-Control-Allow-Credentials", "true");
        res.header("Access-Control-Allow-Origin", origin);
        res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    }
    next();
}