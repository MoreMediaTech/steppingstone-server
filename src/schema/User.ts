import * as z from 'zod';
import {  Role } from "@prisma/client";
import { validate } from '../middleware/validate';

export const userSchema = z.object({
    id: z.string(),
  name: z.string(),
  email: z.string().email('Invalid email address'),
  role: z.nativeEnum(Role),
  county: z.string(),
  district: z.string(),
  isAdmin: z.boolean(),
  organisation: z.string(),
  postCode: z.string(),
  contactNumber: z.string(),
  refreshTokens: z.string(),
  oneTimeCode: z.string().optional(),
  acceptTermsAndConditions: z.boolean(),
  emailVerified: z.boolean(),
  imageUrl: z.string(),
  isNewlyRegistered: z.boolean(),
  isMobile: z.boolean(),
  isSuperAdmin: z.boolean(),
  allowsPushNotifications: z.boolean(),
});

export const Token = z.object({
  token: z.string(),
});

export type UserSchemaProps = z.infer<typeof userSchema>;

export const PartialUserSchema = userSchema.partial();

export type PartialUserSchemaProps = z.infer<typeof PartialUserSchema>;

export const validateUser = validate(userSchema);

export const validatePartialUser = validate(PartialUserSchema);

export const PartialUserSchemaWithToken = PartialUserSchema.merge(Token);

export const validatePartialUserWithToken = validate(PartialUserSchemaWithToken);