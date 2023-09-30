import { Prettify } from './helpers';
import * as z from 'zod';

export enum PartnerType {
    PARTNER = "PARTNER", 
    LEAD_PARTNER = "LEAD_PARTNER",
    SENIOR_CONTACT = "SENIOR_CONTACT"
}

export const partnerSchema = z.object({
    id: z.string(),
  name: z.string(),
  email: z.string().email(),
  organisation: z.string(),
  position: z.string(),
  website: z.string().url(),
  businessType: z.string(),
  partner: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
  }),
  partnerType: z.nativeEnum(PartnerType),
  isEmail: z.boolean(),
  projectsResponsibleFor: z.string(),
  valueCategory: z.string(),
  closingDate: z.string(),
  createdAt: z.string(),
    updatedAt: z.string(),
});

export const partnerWithOrganisationSchema = partnerSchema.extend({
    organisation: z.object({
        id: z.string(),
        name: z.string(),
    }),
});

export const partialPartnerWithOrganisationSchema = partnerWithOrganisationSchema.partial();

export const partialPartnerSchema = partnerSchema.partial();

export type PartnerProps = Prettify<z.infer<typeof partnerSchema>>;

export type PartnerWithOrganisationProps = Prettify<z.infer<typeof partnerWithOrganisationSchema>>;

export type PartialPartnerWithOrganisationProps = Prettify<z.infer<typeof partialPartnerWithOrganisationSchema>>;

export type PartialPartnerProps = Prettify<z.infer<typeof partialPartnerSchema>>;