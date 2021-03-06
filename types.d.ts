import { Text } from '@mantine/core';
import { AreasOfOperation, EmailType, Role, Status } from "@prisma/client";
import { Request } from "express";

export interface RequestWithUser extends Request {
  user?: {
    id: string;
    email: string;
    isAdmin: boolean;
    name: string;
    role: Role;
    county: string;
    district: string;
    isAdmin?: boolean;
    organisation: string;
    postCode: string;
    contactNumber: string;
    refreshTokens?: string;
    acceptTermsAndConditions: boolean;
    emailVerified: boolean;
    imageUrl: string;
    isSuperAdmin: boolean;
  } | null;
}

export interface User {
  id?: string;
  name?: string;
  email: string;
  password: string;
  confirmPassword?: string;
  role?: Role;
  county?: string;
  district?: string;
  isAdmin?: boolean;
  organisation?: string;
  postCode?: string;
  contactNumber?: string;
  refreshTokens?: string;
  acceptTermsAndConditions?: boolean;
  emailVerified?: boolean;
  imageUrl?: string;
}

export type PartnerData = {
  id?: string;
  title: string;
  subtitle: string;
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

export interface IEmailFormData {
  from: string;
  to: string;
  company?: string;
  text?: string;
  subject: string;
  message?: string;
  html: string;
  emailType?: EmailType;
  token?: string;
}

export type DataProps = {
  id: string;
  name: string;
  userId: string;
  comment: string;
  countyId: string;
  imageUrl: string;
  logoIcon: string;
  title: string;
  content: string;
  districtId: string;
  whyInvest: {
    id: string;
    title: string;
    content: string;
    imageUrl: string;
  };
  workingAgePopulation: number;
  labourDemand: number;
  noOfRetailShops: number;
  unemploymentRate: number;
  employmentInvestmentLand: number;
  numOfRegisteredCompanies: number;
  numOfBusinessParks: number;
  averageHousingCost: number;
  averageWageEarnings: number;
  supportForStartupId: string;
  sectionId: string;
  subSectionId: string;
  isSubSection: boolean;
  isSubSubSection: boolean;
  isLive: boolean;
};
