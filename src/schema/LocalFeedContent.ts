import * as z from "zod";

import { Prettify } from "./helpers";
import { sectionSchema } from "./Section";

export const economicDataSchema = z.object({
  id: z.string({ required_error: "ID is required" }),
  ids: z.array(z.string()).optional(),
  title: z.string({ required_error: "Title is required" }),
  stats: z.string({ required_error: "Stats is required" }),
  descriptionLine1: z.string({
    required_error: "Description Line 1 is required",
  }),
  descriptionLine2: z.string({
    required_error: "Description Line 2 is required",
  }),
  sectionId: z.string({ required_error: "Local Feed Content ID is required" }),
  linkName: z.string({ required_error: "Link Name is required" }),
  linkUrl: z.string({ required_error: "Link URL is required" }),
  createdAt: z.string({ required_error: "Created At is required" }),
  updatedAt: z.string({ required_error: "Updated At is required" }),
});

export const partialEconomicDataSchema = economicDataSchema.partial();

export type EconomicDataSchemaProps = Prettify<
  z.infer<typeof economicDataSchema>
>;
export type PartialEconomicDataSchemaProps = Prettify<
  z.infer<typeof partialEconomicDataSchema>
>;

export const localFeedContentSchema = z.object({
  id: z.string(),
  ids: z.array(z.string()).optional(),
  name: z.string(),
  imageUrl: z.string(),
  imageFile: z.string().optional(),
  logoIcon: z.string(),
  isLive: z.boolean(),
  feedContent: z.object({
    id: z.string(),
    name: z.string(),
    logoIcon: z.string().url(),
  }),
  feedContentId: z.string(),
  sections: z.lazy(() => z.array(sectionSchema)),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const partialLocalFeedSchema = localFeedContentSchema.partial();

export type LocalFeedContentSchemaProps = Prettify<
  z.infer<typeof localFeedContentSchema>
>;

export type PartialLocalFeedContentSchemaProps = Prettify<
  z.infer<typeof partialLocalFeedSchema>
>;
