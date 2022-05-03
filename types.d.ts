import { Request } from "express";

export interface RequestWithUser extends Request {
  user?: {
    id: string;
    email: string;
    isAdmin: boolean;
    name: string;
    role: string;
  } | null;
}
