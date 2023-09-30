import * as z from "zod";

import { Prettify } from "./helpers";

export const economicDataSchema = z.object({
  id: z.string().nonempty({ message: "ID is required" }),
  title: z.string().nonempty({ message: "Title is required" }),
  stats: z.string().nonempty({ message: "Stats is required" }),
  descriptionLine1: z
    .string()
    .nonempty({ message: "Description Line 1 is required" }),
  descriptionLine2: z
    .string()
    .nonempty({ message: "Description Line 2 is required" }),
  linkName: z.string().nonempty({ message: "Link Name is required" }),
  linkUrl: z.string().nonempty({ message: "Link URL is required" }),
  createdAt: z.string().nonempty({ message: "Created At is required" }),
  updatedAt: z.string().nonempty({ message: "Updated At is required" }),
});

export const partialEconomicDataSchema = economicDataSchema.partial();

export type EconomicDataSchemaProps = Prettify<z.infer<typeof economicDataSchema>>;
export type PartialEconomicDataSchemaProps = Prettify<z.infer<typeof partialEconomicDataSchema>>;

export const districtSectionSchema = z.object({
  id: z.string().nonempty({ message: "ID is required" }),
  name: z.string().nonempty({ message: "Name is required" }),
  title: z.string().nonempty({ message: "Title is required" }),
  content: z.string().nonempty({ message: "Content is required" }),
  isLive: z.boolean(),
  isSubSection: z.boolean(),
  logoIcon: z
    .string()
    .url({ message: "Logo icon must be a URL" })
    .nonempty({ message: "Logo Icon is required" }),
  imageUrl: z.string().nonempty({ message: "Image URL is required" }),
  videoUrl: z.string().nonempty({ message: "Video URL is required" }),
  videoTitle: z.string().nonempty({ message: "Video Title is required" }),
  videoDescription: z
    .string()
    .nonempty({ message: "Video Description is required" }),
  author: z.string().nonempty({ message: "Author is required" }),
  summary: z.string().nonempty({ message: "Summary is required" }),
  isEconomicData: z.boolean(),
  economicDataWidgets: z.array(economicDataSchema),
  createdAt: z.string().nonempty({ message: "Created At is required" }),
  updatedAt: z.string().nonempty({ message: "Updated At is required" }),
});

export const partialDistrictSectionSchema = districtSectionSchema.partial();

export type DistrictSectionSchemaProps = Prettify<
  z.infer<typeof districtSectionSchema>
>;

export type PartialDistrictSectionSchemaProps = Prettify<
  z.infer<typeof partialDistrictSectionSchema>
>;

export const districtSchema = z.object({
  id: z.string(),
  name: z.string(),
  imageUrl: z.string(),
  logoIcon: z.string(),
  isLive: z.boolean(),
  county: z.object({
    id: z.string(),
    name: z.string(),
    logoIcon: z.string().url(),
  }),
  districtSections: z.array(districtSectionSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const partialDistrictSchema = districtSchema.partial();

export type DistrictSchemaProps = Prettify<z.infer<typeof districtSchema>>;

export type PartialDistrictSchemaProps = Prettify<
  z.infer<typeof partialDistrictSchema>
>;
