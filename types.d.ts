import { AreasOfOperation, Role, Status } from "@prisma/client";
import { Request } from "express";

export interface RequestWithUser extends Request {
  user?: {
    id: string;
    email: string;
    isAdmin: boolean;
    name: string;
    role: Role;
  } | null;
}

export interface User {
  id?: string;
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  role?: Role;
  county: string;
  district: string;
  isAdmin?: boolean;
  organisation: string;
  postCode: string;
  contactNumber: string;
  acceptTermsAndConditions: boolean;
}

export type PartnerData = {
  id?: string;
  title: string;
  organisation: string;
  description: string;
  category: string;
  businessType: string;
  website: string;
  isLive?: boolean;
  isHidden?: boolean;
  isApproved?: boolean;
  status?: Status;
  areaOfOperation: AreasOfOperation;
};
