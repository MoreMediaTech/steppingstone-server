import * as z from 'zod';
import {  Role } from "@prisma/client";

export const userSchema = z.object({
    id: z.string(),
  name: z.string(),
  email: z.string(),
  role: z.enum([Role.PARTNER, Role.USER, Role.SS_EDITOR, Role.COUNTY_EDITOR]),
  county: z.string(),
  district: z.string(),
  isAdmin: z.boolean(),
  organisation: z.string(),
  postCode: z.string(),
  contactNumber: z.string(),
  refreshTokens: z.string(),
  acceptTermsAndConditions: z.boolean(),
  emailVerified: z.boolean(),
  imageUrl: z.string(),
  isNewlyRegistered: z.boolean(),
  isMobile: z.boolean(),
  isSuperAdmin: z.boolean(),
  allowsPushNotifications: z.boolean(),
});

export type UserSchemaProps = z.infer<typeof userSchema>;